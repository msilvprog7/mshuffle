import {MshuffleClientAPI} from "../../../shared/mshuffle";

import {AudioAPI} from "../../../shared/audio";
import Html5AudioAPI from "../audio/Html5AudioAPI";
import {Playlist, Song} from "../../../shared/music";

import {DisplayAPI} from "../../../shared/display";
import LoggedInDisplayFeature from "../display/LoggedInDisplayFeature";
import PlayButtonToggleDisplayFeature from "../display/PlayButtonToggleDisplayFeature";
import PlaylistDisplayFeature from "../display/PlaylistDisplayFeature";
import PlaylistsDisplayFeature from "../display/PlaylistsDisplayFeature";
import PMFChartDisplayFeature from "../display/PMFChartDisplayFeature";
import SongDisplayFeature from "../display/SongDisplayFeature";
import UserDisplayFeature from "../display/UserDisplayFeature";
import SiteDisplayAPI from "../display/SiteDisplayAPI";

import {HttpRequestAPI, RequestError, RequestOptions, RequestSuccess, RequestType} from "../../../shared/http";
import JQueryRequestAPI from "../http/JQueryRequestAPI";

import {Id, Identifiable, User} from "../../../shared/auth";

import {PMFData} from "../../../shared/data";

import * as $ from "jquery";


/**
 * API for interacting with Mshuffle from the site
 */
export default class MshuffleSiteAPI extends MshuffleClientAPI {
    /**
     * Back to playlists button id
     */
    public static BackToPlaylistsButtonId = "backToPlaylistsButton";

    /**
     * Dislike button id
     */
    public static DislikeButtonId = "dislikeButton";

    /**
     * Enjoy button id
     */
    public static EnjoyButtonId = "enjoyButton";

    /**
     * Play button id
     */
    public static PlayButtonId = "playButton";

    /**
     * Playlist image id
     */
    public static PlaylistImageId = "playlistImage";

    /**
     * Skip button id
     */
    public static SkipButtonId = "skipButton";

    /**
     * Audio API
     */
    private audioAPI: AudioAPI;

    /**
     * Display API
     */
    private displayAPI: DisplayAPI;

    /**
     * Http Request API
     */
    private httpRequestAPI: HttpRequestAPI;

    /**
     * Is the song loaded
     */
    private loaded: boolean;

    /**
     * Is the song playing
     */
    private playing: boolean;

    /**
     * Playlist
     */
    private playlist: Playlist | null;

    /**
     * Current song
     */
    private currentSong: Song | null;

    /**
     * Current song id
     */
    private currentSongId: Id | null;

    /**
     * Create an instance of a MshuffleSiteAPI
     */
    constructor() {
        super();
        this.audioAPI = new Html5AudioAPI();
        this.displayAPI = new SiteDisplayAPI(this);
        this.httpRequestAPI = new JQueryRequestAPI();
        this.loaded = false;
        this.playing = false;
        this.playlist = null;
        this.currentSong = null;
        this.currentSongId = null;
        this.registerControls();
    }

    /**
     * Play music
     */
    play(): void {
        if (this.currentSong === null) {
            // Generate first song
            this.next();
        } else {
            // Pause or play (opposite of current playing status)
            this.playing = !this.playing;
            this.changeMusic();
            this.displayAPI.fillCascade(PlayButtonToggleDisplayFeature.DisplayFeatureId, this.playing);
        }
    }

    /**
     * Stop music
     */
    stop(): void {
        this.playlist = null;
        this.currentSong = null;
        this.currentSongId = null;
        this.playing = false;
        this.loaded = false;

        this.displayAPI.fillCascade(PlayButtonToggleDisplayFeature.DisplayFeatureId, this.playing);
        this.audioAPI.pause();
    }

    /**
     * Get the next song and play it
     */
    next(): void {
        this.httpRequestAPI.send({
                url: "/next", 
                type: RequestType.GET 
            },
            RequestSuccess.make(function (data?: any): void {
                if (Song.IsSong(data)) {
                    // Update current song
                    this.setCurrent(data);
                    this.play();

                    // Update probabilities visualized
                    this.getPMF();
                } else {
                    console.error("MshuffleSiteAPI: next() response is unplayable");
                }
            }.bind(this)),
            RequestError.generic());
    }

    /**
     * Skip to the next song and play it
     */
    skip(): void {
        this.httpRequestAPI.send({
                url: "/skip", 
                type: RequestType.GET 
            },
            RequestSuccess.make(function (data?: any): void {
                if (Song.IsSong(data)) {
						this.setCurrent(data);
						this.play();

						// Update probabilities visualized
						this.getPMF();
                } else {
                    console.error("MshuffleSiteAPI: skip() response is unplayable");
                }
            }.bind(this)),
            RequestError.generic());
    }

    /**
     * Let mshuffle know that you enjoy the current song
     */
    enjoy(): void {
        this.httpRequestAPI.send({
                url: "/enjoy", 
                type: RequestType.GET 
            },
            RequestSuccess.make(function (data?: any): void {
                if (PMFData.IsPMF(data)) {
                    this.displayAPI.fillCascade(PMFChartDisplayFeature.DisplayFeatureId, data);
                } else {
                    console.error("MshuffleSiteAPI: enjoy() response could not be displayed");
                }
            }.bind(this)),
            RequestError.generic());
    }

    /**
     * Let mshuffle know that you dislike the current song
     */
    dislike(): void {
        this.httpRequestAPI.send({
                url: "/dislike", 
                type: RequestType.GET 
            },
            RequestSuccess.make(function (data?: any): void {
                if (PMFData.IsPMF(data)) {
                    this.displayAPI.fillCascade(PMFChartDisplayFeature.DisplayFeatureId, data);
                } else {
                    console.error("MshuffleSiteAPI: dislike() response could not be displayed");
                }
            }.bind(this)),
            RequestError.generic());
    }

    /**
     * Get the PMF for the current listening session for visualization
     */
    getPMF(): void {
        this.httpRequestAPI.send({
                url: "/pmf", 
                type: RequestType.GET 
            },
            RequestSuccess.make(function (data?: any): void {
                if (PMFData.IsPMF(data)) {
                    this.displayAPI.fillCascade(PMFChartDisplayFeature.DisplayFeatureId, data);
                } else {
                    console.error("MshuffleSiteAPI: pmf() response could not be displayed");
                }
            }.bind(this)),
            RequestError.generic());
    }

    /**
     * Get the playlist
     * @param userId User Id
     * @param playlistId Playlist Id
     */
    getPlaylist(userId: Id, playlistId: Id): void {
        this.httpRequestAPI.send({
                url: `/playlists/${userId}/${playlistId}`,
                type: RequestType.GET 
            },
            RequestSuccess.make(function (data?: any): void {
                if (Playlist.IsPlaylist(data)) {
                    this.playlist = data;
                    this.displayAPI.fillCascade(PlaylistDisplayFeature.DisplayFeatureId, data);

                    // Get the PMF to display
                    this.getPMF();
                } else {
                    console.error("MshuffleSiteAPI: getPlaylist() response was not a valid playlist");
                }
            }.bind(this)),
            RequestError.generic());
    }

    /**
     * Get the user's playlists
     */
    getPlaylists(): void {
        this.httpRequestAPI.send({
                url: "/playlists",
                type: RequestType.GET 
            },
            RequestSuccess.make(function (data?: any): void {
                if (Playlist.ArePlaylists(data)) {
                    this.displayAPI.fillCascade(PlaylistsDisplayFeature.DisplayFeatureId, data);
                    this.displayAPI.showCascade(PlaylistsDisplayFeature.DisplayFeatureId);
                } else {
                    console.error("MshuffleSiteAPI: getPlaylists() response did not include valid playlists");
                }
            }.bind(this)),
            RequestError.generic());
    }

    /**
     * Get User information
     */
    getUser(): void {
        this.httpRequestAPI.send({
                url: "/user-info",
                type: RequestType.GET 
            },
            RequestSuccess.make(function (data?: any): void {
                if (User.IsUser(data)) {
                    this.displayAPI.fillCascade(UserDisplayFeature.DisplayFeatureId, data);
                    this.displayAPI.showCascade(LoggedInDisplayFeature.DisplayFeatureId);
                } else {
                    console.error("MshuffleSiteAPI: getUser() response did not include valid User data");
                }
            }.bind(this)),
            RequestError.makeUnauthorized(function (): void {
                this.displayAPI.hideCascade(LoggedInDisplayFeature.DisplayFeatureId);
            }.bind(this)));
    }

    /**
     * The current song has changed, change play state
     * accordingly for the new song
     */
    private changeMusic(): void {
        // Handle misuse
        if (this.currentSong === null) {
            console.error("Cannot change music selection when no song is being played...");
            return;
        }

        // Check to make sure preview is available
        if (this.currentSong.url === undefined || this.currentSong.url === null) {
            this.next();
            return;
        }

        // Load preview song if not yet loaded with callback to get next song
        if (!this.loaded) {
            this.audioAPI.load(this.currentSong.url, this.next.bind(this));
            this.loaded = true;
        }

        // Play or pause
        if (this.playing) {
            this.audioAPI.play();
        } else {
            this.audioAPI.pause();
        }
    }

    /**
     * Set current song playing
     */
    private setCurrent(song: Song): void {
        // Assign current song
        this.currentSong = song;

        // Set to paused
        this.playing = false;

        // Not yet loaded
        this.loaded = false;

        // Display information on song
        this.displayAPI.fillCascade(SongDisplayFeature.DisplayFeatureId, this.currentSong);
    }

    /**
     * Helper method to go back to viewing a user's playlists
     */
    private backToPlaylists(): void {
        this.displayAPI.hideCascade(PlaylistDisplayFeature.DisplayFeatureId);
        this.getPlaylists();
    }

    /**
     * Register controls for mshuffle
     */
    private registerControls(): void {
        // Back to playlists
        $(`#${MshuffleSiteAPI.BackToPlaylistsButtonId}`).click(this.backToPlaylists.bind(this));
        // Playlist image click to play
        $(`#${MshuffleSiteAPI.PlaylistImageId}`).click(this.play.bind(this));
        // Enjoy button
        $(`#${MshuffleSiteAPI.EnjoyButtonId}`).click(this.enjoy.bind(this));
        // Dislike button
        $(`#${MshuffleSiteAPI.DislikeButtonId}`).click(this.dislike.bind(this));
        // Play button
        $(`#${MshuffleSiteAPI.PlayButtonId}`).click(this.play.bind(this));
        // Skip button
        $(`#${MshuffleSiteAPI.SkipButtonId}`).click(this.skip.bind(this));
    }
}
