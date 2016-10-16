import {DisplayFeature} from "../../../shared/display";

import {Id} from "../../../shared/auth";

import {Playlist} from "../../../shared/music";

import {MshuffleClientAPI} from "../../../shared/mshuffle";

import * as $ from "jquery";


/**
 * Display Feature for displaying the user's playlists
 */
export default class PlaylistsDisplayFeature extends DisplayFeature {
    /**
     * Static Id
     */
    public static DisplayFeatureId = "Playlists";
    
    /**
     * Selector for Playlists by class name
     */
    private static PlaylistsClassNameSelector = ".playlists";
    /**
     * Selector for Playlists by name
     */
    private static PlaylistsNameSelector = "[name='playlists']";

    /**
     * Class name for a playlist
     */
    private static PlaylistClassName = "playlist";

    /**
     * Selector for View Playlists by class name
     */
    private static ViewPlaylistsClassNameSelector = ".view-playlists";

    /**
     * Create an instace of PlaylistsDisplayFeature
     * @param mshuffleClientAPI MshuffleClientAPI
     */
    constructor(private mshuffleClientAPI: MshuffleClientAPI) {
        super(PlaylistsDisplayFeature.DisplayFeatureId);
    }

    /**
     * Fill the user's playlists as content with click
     * listener for mshuffle client
     * @param content Playlist[]
     */
    fill(content: any): void {
        super.fill(content);

        Playlist.GetPlaylists(content).forEach(function (playlist) {
            // Skip if no image (some local playlists can come up)
            if (playlist.image === undefined || playlist.image === null) {
                return;
            }
            
            let img = "<img src='" + playlist.image + "' />",
                div = $("<div />", {
                    "class": PlaylistsDisplayFeature.PlaylistClassName,
                    html: img + "<span>" + playlist.name + "</span>",
                    click: function () {
                        // Click - client gets playlist
                        this.mshuffleClientAPI.getPlaylist(playlist.owner, playlist.id);
                    }.bind(this)
                });

            $(PlaylistsDisplayFeature.PlaylistsNameSelector).append(div);
        }.bind(this));
    }

    /**
     * Hide the user's playlists
     */
    hide(): void {
        super.hide();
        $(PlaylistsDisplayFeature.PlaylistsClassNameSelector).hide();
        $(PlaylistsDisplayFeature.ViewPlaylistsClassNameSelector).hide();
    }

    /**
     * Show the user's playlists
     */
    show(): void {
        super.show();

        $(PlaylistsDisplayFeature.PlaylistsClassNameSelector).show();
        $(PlaylistsDisplayFeature.ViewPlaylistsClassNameSelector).show();

        // Stop the mshuffle client
        this.mshuffleClientAPI.stop();
    }
}
