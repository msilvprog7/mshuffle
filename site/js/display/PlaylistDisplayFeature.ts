import {DisplayFeature} from "../../../shared/display";
import PlaylistsDisplayFeature from "./PlaylistsDisplayFeature";

import {Id} from "../../../shared/auth";

import {Playlist} from "../../../shared/music";

import {ChartAPI} from "../../../shared/chart";
import {PMFData} from "../../../shared/data";

import * as $ from "jquery";


/**
 * Display Feature for a single user playlist
 */
export default class PlaylistDisplayFeature extends DisplayFeature {
    /**
     * Static Id
     */
    public static DisplayFeatureId = "Playlist";
    
    /**
     * Selector for a playlist's image
     */
    private static PlaylistImageSelector = "img[name='playlistImage']";

    /**
     * Selector for a playlist's name
     */
    private static PlaylistNameSelector = "[name='playlistName']";

    /**
     * Selector for a playlist's song artist
     */
    private static PlaylistSongArtistSelector = "[name='playlistSongArtist']";

    /**
     * Selector for a playlist's song name
     */
    private static PlaylistSongNameSelector = "[name='playlistSongName']";

    /**
     * Selector for View Playlist by class name
     */
    private static ViewPlaylistClassNameSelector = ".view-playlist";

    /**
     * Create an instance of PlaylistDisplayFeature
     * @param pmfChartAPI PMF Chart API
     */
    constructor(private pmfChartAPI: ChartAPI<PMFData>) {
        super(PlaylistDisplayFeature.DisplayFeatureId);
    }

    /**
     * Fill the playlist content
     * @param content Playlist
     */
    fill(content: any): void {
        super.fill(content);
        
        if (Playlist.IsPlaylist(content)) {
            // Display info for playlist
            $(PlaylistDisplayFeature.PlaylistNameSelector).html(content.name);
            $(PlaylistDisplayFeature.PlaylistImageSelector).attr("src", content.image);
            $(PlaylistDisplayFeature.PlaylistSongNameSelector).html(content.name);
            $(PlaylistDisplayFeature.PlaylistSongArtistSelector).html("-------");

            // Show content and hide playlists content
            this.getRootDisplayFeature().hideCascade(PlaylistsDisplayFeature.DisplayFeatureId);
            $(PlaylistDisplayFeature.ViewPlaylistClassNameSelector).show();

            // Clear chart and force it to re-initialize on next data
            this.pmfChartAPI.reset();
        }
    }

    /**
     * Hide the playlist
     */
    hide(): void {
        super.hide();
        $(PlaylistDisplayFeature.ViewPlaylistClassNameSelector).hide();
    }

    /**
     * Show the playlist
     */
    show(): void {
        super.show();
        $(PlaylistDisplayFeature.ViewPlaylistClassNameSelector).show();
    }
}
