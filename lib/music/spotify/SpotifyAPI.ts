import {Artist, MusicAPI, Playlist, Song} from "../../../shared/music";
import {SpotifyCredentials} from "./SpotifyCredentials";

import {Authorization, ClientCredentials, Id, User} from "../../../shared/auth";

import {HttpRequestAPI, RedirectInfo, RequestError, RequestOptions, RequestSuccess, RequestDataType, RequestType, uri} from "../../../shared/http";
import RequestAPI from "../../http/RequestAPI";

import * as querystring from "querystring";


/**
 * Spotify API for interacting with music
 */
export default class SpotifyAPI implements MusicAPI {
    /**
     * Client credentials for the spotify app
     */
    private clientCredentials: ClientCredentials;
    
    /**
     * Http Request API
     */
    private httpRequestAPI: HttpRequestAPI;

    /**
     * Route to API Url
     */
    private static ApiRoute: uri = 'https://api.spotify.com/v1';

    /**
     * Route to Auth Url
     */
    private static AuthRoute: uri = 'https://accounts.spotify.com';

    /**
     * Route to Auth API Url
     */
    private static AuthApiRoute: uri = "https://accounts.spotify.com/api";

    /**
     * Api's State Key for Auth
     */
    private static StateKey: string = 'spotify_auth_state';

    /**
     * State chars for generating a random state for Spotify Auth
     */
    private static readonly STATE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    /**
     * Create an instance of SpotifyAPI
     */
    constructor() {
        this.clientCredentials = SpotifyCredentials;
        this.httpRequestAPI = new RequestAPI();
    }

    /**
     * Handle the callback from authorizing in login stage
     * Based on /callback in https://github.com/spotify/web-api-auth-examples/blob/master/authorization_code/app.js 
     * @param req Request
     * @param res Response
     * @param success RequestSuccess
     * @param error RequestError
     */
    authCallback(req: any, res: any, success: RequestSuccess, error: RequestError): void {
        let code: string | null = req.query.code || null;
        let state: string | null = req.query.state || null;
        let storedState: string | null = (req.cookies) ? req.cookies[SpotifyAPI.StateKey] : null;
        
        if (state === null || state !== storedState) {
            error.error(409, 'Spotify API state mismatch');
        } else {
            // Clear state
            res.clearCookie(SpotifyAPI.StateKey);

            // Request authorization tokens
            let options: RequestOptions = {
                url: `${SpotifyAPI.AuthApiRoute}/token`,
                type: RequestType.POST,
                headers: Authorization.GetAuthBasicHeader(this.clientCredentials),
                dataType: RequestDataType.JSON,
                urlEncodedForm: {
                    code: code,
                    redirect_uri: this.clientCredentials.redirectUri,
                    grant_type: 'authorization_code'
                }
            };

            this.httpRequestAPI.send(
                options,
                RequestSuccess.make(function (data?: any): void {
                    if (data === undefined || data.access_token === undefined || data.refresh_token === undefined) {
                        error.error(403, "No auth token response from Spotify API");
                        return;
                    }

                    let auth: Authorization = {
                        accessToken: data.access_token,
                        refreshToken: data.refresh_token  
                    };

                    success.success(auth);
                }.bind(this)),
                error);
        }
    }

    /**
     * Login, get redirect info
     * Based on /login in https://github.com/spotify/web-api-auth-examples/blob/master/authorization_code/app.js 
     * @returns Redirect Info
     */
    login(): RedirectInfo {
        // Set the rand 16 char state
        let state: string = SpotifyAPI.GenerateState(16);
        
        let redirectInfo: RedirectInfo = {
            url: `${SpotifyAPI.AuthRoute}/authorize?` + querystring.stringify({
                    response_type: 'code',
                    client_id: this.clientCredentials.clientId,
                    scope: this.clientCredentials.scopes.join(" "),
                    redirect_uri: this.clientCredentials.redirectUri,
                    state: state
                }),
            cookies: {}
        };
        
        // Set cookies
        redirectInfo.cookies[SpotifyAPI.StateKey] = state;

        return redirectInfo;
    }

    /**
     * Get Playlist based on user id and playlist id
     * @param auth Authorization
     * @param userId User's Id
     * @param playlistId Playlist's Id
     * @param success RequestSuccess
     * @param error RequestError
     */
    getPlaylist(auth: Authorization, userId: Id, playlistId: Id, success: RequestSuccess, error: RequestError): void {
        this.recursivleyGetPlaylist(auth, userId, playlistId, success, error);
    }

    /**
     * Get user's playlist (with songs) recursively using spotify's
     * tracking objects
     * @param auth Authorization
     * @param userId Id of the User who owns the playlist
     * @param playlistId Id of the User's Playlist to retrieve
     * @param success RequestSuccess
     * @param error RequestError
     * @param url Url to next tracking object 
     * @param playlist User's playlist being composed
     */
    private recursivleyGetPlaylist(
        auth: Authorization, 
        userId: Id, 
        playlistId: Id, 
        success: RequestSuccess, 
        error: RequestError,
        url?: uri,
        playlist?: Playlist) {
        
        // Use defaults or defined values
		url = (url !== undefined) ? url : `${SpotifyAPI.ApiRoute}/users/${userId}/playlists/${playlistId}`;

        // Get user's playlist
        let options: RequestOptions = {
            url: url,
            type: RequestType.GET,
            headers: Authorization.GetAuthBearerHeader(auth),
            dataType: RequestDataType.JSON
        };

        this.httpRequestAPI.send(
            options,
            RequestSuccess.make(function (data?: any): void {
                if (data === undefined) {
                    error.error(500, "No playlist response from Spotify API");
                    return;
                }

                // Populate playlist info
                if (playlist === undefined) {
                    playlist = {
                        id: data.id,
                        description: (data.description !== undefined) ? data.description : null,
                        image: (data.images && data.images.length > 0 && 
                                data.images[0] !== undefined && data.images[0] !== null &&
                                data.images[0].url !== undefined) 
                                    ? data.images[0].url : null,
                        name: data.name,
                        owner: (data.owner !== undefined && data.owner !== null && 
                                data.owner.id !== undefined)
                                    ? data.owner.id : null,
                        songs: []
                    };
                }

                // Extend playlist tracks (note that if recursively paging, the tracks will be the whole body response)
		        let tracks = (data.tracks) ? data.tracks : data;
		        playlist.songs.push.apply(playlist.songs, tracks.items.map(function (trackObj) {
                    // Get underlying track without playlist info
                    let track = trackObj.track;

                    let song: Song = {
                        id: track.id,
                        album: {
                            id: track.album.id,
                            image: (track.album.images && track.album.images.length > 0 && 
                                    track.album.images[0] !== undefined && track.album.images[0] !== null &&
                                    track.album.images[0].url !== undefined) 
                                        ? track.album.images[0].url : null,
                            name: track.album.name
                        },
                        artists: track.artists.map(function (artistObj) {
                            let artist: Artist = {
                                id: artistObj.id,
                                name: artistObj.name
                            };
                            return artist;
                        }),
                        duration: track.duration_ms / 1000,
                        name: track.name,
                        uri: track.uri,
                        url: track.preview_url
                    };

                    return song;
                }));

                // Recursion
                if (tracks.next) {
                    // Continue retrieving playlist songs
                    this.recursivelyGetPlaylist(auth, userId, playlistId, success, error, tracks.next, playlist);
                } else {
                    // Return playlist
                    success.success(playlist);
                }
            }.bind(this)),
            error);
    }

    /**
     * Get user's playlists
     * @param auth Authorization
     * @param success RequestSuccess
     * @param error RequestError
     */
    getPlaylists(auth: Authorization, success: RequestSuccess, error: RequestError): void {
        this.recursivelyGetPlaylists(auth, success, error);
    }

    /**
     * Get user's playlists recursively using spotify's
     * tracking objects
     * @param auth Authorization
     * @param success RequestSuccess
     * @param error RequestError
     * @param url Url to next tracking object 
     * @param playlists User's playlists being aggregated
     */
    private recursivelyGetPlaylists(
        auth: Authorization, 
        success: RequestSuccess, 
        error: RequestError, 
        url?: uri, 
        playlists?: Playlist[]): void {
        
        // Use defaults or defined values
        url = (url !== undefined) ? url : `${SpotifyAPI.ApiRoute}/me/playlists`;
		playlists = (playlists !== undefined) ? playlists : [];

        let options: RequestOptions = {
            url: url,
            type: RequestType.GET,
            headers: Authorization.GetAuthBearerHeader(auth),
            dataType: RequestDataType.JSON
        };

        this.httpRequestAPI.send(
            options, 
            RequestSuccess.make(function (data?: any): void {
                if (data === undefined || data.items === undefined) {
                    error.error(500, "No playlists response from Spotify API");
                    return;
                }

                // Extend playlists
                playlists.push.apply(playlists, data.items.map(function (playlistResponse) {
                    let playlist: Playlist = {
                        id: playlistResponse.id,
                        description: null,
                        image: (playlistResponse.images && playlistResponse.images.length > 0 &&
                                playlistResponse.images[0] !== undefined && playlistResponse.images[0] !== null && 
                                playlistResponse.images[0].url !== undefined)
                                    ? playlistResponse.images[0].url : null,
                        name: playlistResponse.name,
                        owner: (playlistResponse.owner !== undefined && playlistResponse.owner !== null && 
                                playlistResponse.owner.id !== undefined) 
                                    ? playlistResponse.owner.id : null,
                        songs: null
                    };

                    return playlist;
                }));

                // Recursion
                if (data.next) {
                    // Continue retrieving playlists recursively
                    this.recursivelyGetPlaylists(auth, success, error, data.next, playlists);
                } else {
                    // Return playlists
                    success.success(playlists);
                }
            }.bind(this)), 
            error);
    }

    /**
     * Get similar artists to the artist id provided
     * @param auth Authorization
     * @param artistId Artist's Id
     * @param success RequestSuccess
     * @param error RequestError
     */
    getSimilarArtists(auth: Authorization, artistId: Id, success: RequestSuccess, error: RequestError): void {
        // Get user's playlists
        let options: RequestOptions = {
            url: `${SpotifyAPI.ApiRoute}/artists/${artistId}/related-artists`,
            type: RequestType.GET,
            headers: Authorization.GetAuthBearerHeader(auth),
            dataType: RequestDataType.JSON
        };

        this.httpRequestAPI.get(
            options,
            RequestSuccess.make(function (data?: any): void {
                // Send similar artists
                let artists: Artist[] = [];

                if (data && data.artists && data.artists.length > 0) {
                    artists = data.artists.map(function (artistObj) {
                        let artist: Artist = {
                            id: artistObj.id,
                            name: artistObj.name
                        };
                        return artist;
                    });
                }

                success.success(artists);
            }.bind(this)),
            error);
    }

    /**
     * Get user information
     * @param auth Authorization
     * @param success RequestSuccess
     * @param error RequestError
     */
    getUser(auth: Authorization, success: RequestSuccess, error: RequestError): void {
        let options: RequestOptions = {
            url: `${SpotifyAPI.ApiRoute}/me`,
            type: RequestType.GET,
            headers: Authorization.GetAuthBearerHeader(auth),
            dataType: RequestDataType.JSON
        };

        this.httpRequestAPI.send(
            options, 
            RequestSuccess.make(function (data?: any): void {
                let user: User = {
                    fullname: (data !== undefined && data.display_name !== undefined) ? data.display_name : null
                };

                success.success(user);
            }.bind(this)), 
            error);
    }
    
    /**
     * Handle refreshing the user's token for Spotify Auth
     * Based on /refresh_token in https://github.com/spotify/web-api-auth-examples/blob/master/authorization_code/app.js 
     * @param auth Authorization
     * @param success RequestSuccess
     * @param error RequestError
     */
    refreshToken(auth: Authorization, success: RequestSuccess, error: RequestError): void {
        // Use user's refresh token stored in the current user's session
        let options: RequestOptions = {
            url: `${SpotifyAPI.AuthApiRoute}/token`,
            type: RequestType.POST,
            headers: Authorization.GetAuthBasicHeader(this.clientCredentials),
            dataType: RequestDataType.JSON,
            urlEncodedForm: {
                grant_type: 'refresh_token',
                refresh_token: auth.refreshToken
            }
        };

        // Request new token
        this.httpRequestAPI.send(
            options,
            RequestSuccess.make(function (data?: any): void {
                if (data === undefined || data.access_token === undefined) {
                    error.error(403, "No auth token response from Spotify API");
                    return;
                }
                
                let newAuth: Authorization = {
                    accessToken: data.access_token,
                    refreshToken: auth.refreshToken
                };

                success.success(newAuth);
            }.bind(this)),
            error);
    }

    /**
     * Generate random string of characters for state to send to Spotify server
     * Based on generateRandomString(length) in https://github.com/spotify/web-api-auth-examples/blob/master/authorization_code/app.js 
     * @param length Number of chars
     * @returns Random state string
     */
    public static GenerateState(length: number): string {
        return Array.apply(null, Array(length))
            .map(() => SpotifyAPI.STATE_CHARS.charAt(Math.floor(Math.random() * SpotifyAPI.STATE_CHARS.length)))
                .reduce((prev: string, curr: string) => prev + curr, "");
    }
}
