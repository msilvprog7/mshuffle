/**
 * Music type aliases and interfaces
 */

import {Authorization, Id, Identifiable} from "./auth";

import {RedirectInfo, RequestSuccess, RequestError, uri} from "./http";


/**
 * Interface for an Album
 */
export interface Album extends Identifiable {
    /**
     * Album's image URI
     */
    readonly image: uri;

    /**
     * Album's name
     */
    readonly name: string;
}

/**
 * Static methods for an Album
 */
export class Album {
    /**
     * Album[] type guard
     */
    public static AreAlbums(albums: any): albums is Album[] {
        if (!(albums instanceof Array)) {
            return false;
        }

        for (let album of albums) {
            if (!Album.IsAlbum(album)) {
                return false;
            }
        }

        return true;
    }
    
    /**
     * Convert to Album[]
     */
    public static GetAlbums(albums: any): Album[] {
        let results: Album[] = [];
        
        if (albums instanceof Array) {
            for (let album of albums) {
                if (Album.IsAlbum(album)) {
                    results.push(album);
                }
            }
        }

        return results;
    }

    /**
     * Album's type guard
     */
    public static IsAlbum(album: any): album is Album {
        return (album !== undefined &&
            album !== null &&
            "id" in album &&
            "image" in album &&
            "name" in album);
    }
}

/**
 * Interface for an Artist
 */
export interface Artist extends Identifiable {
    /**
     * Artist's name
     */
    readonly name: string;
}

/**
 * Static methods for an Artist
 */
export class Artist {
    /**
     * Artist[] type guard
     */
    public static AreArtists(artists: any): artists is Artist[] {
        if (!(artists instanceof Array)) {
            return false;
        }

        for (let artist of artists) {
            if (!Artist.IsArtist(artist)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Convert to Artist[]
     */
    public static GetArtists(artists: any): Artist[] {
        let results: Artist[] = [];
        
        if (artists instanceof Array) {
            for (let artist of artists) {
                if (Artist.IsArtist(artist)) {
                    results.push(artist);
                }
            }
        }

        return results;
    }

    /**
     * Artist type guard
     */
    public static IsArtist(artist: any): artist is Artist {
        return (artist !== undefined &&
            artist !== null &&
            "id" in artist &&
            "name" in artist);
    }
}

/**
 * Interface for a Playlist
 */
export interface Playlist extends Identifiable {
    /**
     * Playlist's description
     */
    readonly description: string;

    /**
     * Playlist's image URI
     */
    readonly image: uri | null;

    /**
     * Playlist's name
     */
    readonly name: string;

    /**
     * Owner
     */
    readonly owner: Id;

    /**
     * Songs
     */
    readonly songs: Song[] | null;
}

/**
 * Static methods for a Playlist
 */
export class Playlist {
    /**
     * Playlist[] type guard
     */
    public static ArePlaylists(playlists: any): playlists is Playlist[] {
        if (!(playlists instanceof Array)) {
            return false;
        }

        for (let playlist of playlists) {
            if (!Playlist.IsPlaylist(playlist)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Convert to Playlist[]
     */
    public static GetPlaylists(playlists: any): Playlist[] {
        let results: Playlist[] = [];
        
        if (playlists instanceof Array) {
            for (let playlist of playlists) {
                if (Playlist.IsPlaylist(playlist)) {
                    results.push(playlist);
                }
            }
        }

        return results;
    }

    /**
     * Playlist type guard
     */
    public static IsPlaylist(playlist: any): playlist is Playlist {
        return (playlist !== undefined &&
            playlist !== null &&
            "id" in playlist && 
            "description" in playlist && 
            "image" in playlist && 
            "name" in playlist && 
            "owner" in playlist &&
            "songs" in playlist &&
            (playlist.songs === null || 
             Song.AreSongs(playlist.songs)));
    }
}

/**
 * Interface for a Song
 */
export interface Song extends Identifiable {
    /**
     * Song's album
     */
    readonly album: Album;

    /**
     * Song's artists
     */
    readonly artists: Artist[];

    /**
     * Song's duration in seconds
     */
    readonly duration: number;

    /**
     * Song's name
     */
    readonly name: string;

    /**
     * Song's URI
     */
    readonly uri: uri;

    /**
     * Song's preview
     */
    readonly url?: uri;
}

/**
 * Static methods for a Song
 */
export class Song {
    /**
     * Song[] type guard
     */
    public static AreSongs(songs: any): songs is Song[] {
        if (!(songs instanceof Array)) {
            return false;
        }

        for (let song of songs) {
            if (!Song.IsSong(song)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Convert to Song[]
     */
    public static GetSongs(songs: any): Song[] {
        let results: Song[] = [];
        
        if (songs instanceof Array) {
            for (let song of songs) {
                if (Song.IsSong(song)) {
                    results.push(song);
                }
            }
        }

        return results;
    }

    /**
     * Song type guard
     */
    public static IsSong(song: any): song is Song {
        return (song !== undefined &&
            song !== null &&
            "id" in song &&
            "album" in song && Album.IsAlbum(song.album) &&
            "artists" in song && Artist.AreArtists(song.artists) &&
            "duration" in song && 
            "name" in song && 
            "uri" in song);
    }
}

/**
 * Abstract class for an API to access Music
 */
export abstract class MusicAPI {
    /**
     * Callback for authorization from login
     * @param req Request
     * @param res Response
     * @param success RequestSuccess
     * @param error RequestError
     */
    abstract authCallback(req: any, res: any, 
        success: RequestSuccess, error: RequestError): void;
    
    /**
     * Login, get redirect info 
     * @returns Redirect Information
     */
    abstract login(): RedirectInfo;

    /**
     * Get Playlist based on user id and playlist id
     * @param auth Authorization
     * @param userId User's Id
     * @param playlistId Playlist's Id
     * @param success RequestSuccess
     * @param error RequestError
     */
    abstract getPlaylist(auth: Authorization, userId: Id, playlistId: Id, 
        success: RequestSuccess, error: RequestError): void;

    /**
     * Get user's playlists
     * @param auth Authorization
     * @param success RequestSuccess
     * @param error RequestError
     */
    abstract getPlaylists(auth: Authorization, 
        success: RequestSuccess, error: RequestError): void;

    /**
     * Get similar artists to the artist id provided
     * @param auth Authorization
     * @param artistId Artist's Id
     * @param success RequestSuccess
     * @param error RequestError
     */
    abstract getSimilarArtists(auth: Authorization, artistId: Id, 
        success: RequestSuccess, error: RequestError): void;

    /**
     * Get user information
     * @param auth Authorization
     * @param success RequestSuccess
     * @param error RequestError
     */
    abstract getUser(auth: Authorization, 
        success: RequestSuccess, error: RequestError): void;
    
    /**
     * Refresh the auth token
     * @param auth Authorization
     * @param success RequestSuccess
     * @param error RequestError
     */
    abstract refreshToken(auth: Authorization, 
        success: RequestSuccess, error: RequestError): void;
}
