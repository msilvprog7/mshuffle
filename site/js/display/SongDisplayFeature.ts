import {DisplayFeature} from "../../../shared/display";

import {Song} from "../../../shared/music";

import * as $ from "jquery";


/**
 * Display Feature for a Song
 */
export default class SongDisplayFeature extends DisplayFeature {
    /**
     * Static Id
     */
    public static DisplayFeatureId = "Song";
    
    /**
     * Selector for a playlist's image
     */
    private static PlaylistImageSelector = "img[name='playlistImage']";

    /**
     * Selector for a song's artist
     */
    private static SongArtistSelector = "[name='playlistSongArtist']";

    /**
     * Selector for a song's name
     */
    private static SongNameSelector = "[name='playlistSongName']";

    /**
     * Create an instance of a SongDisplayFeature
     */
    constructor() {
        super(SongDisplayFeature.DisplayFeatureId);
    }

    /**
     * Fill song information
     * @param content Song
     */
    fill(content: any) {
        super.fill(content);
        
        if (Song.IsSong(content)) {
            // Display info for new song
            $(SongDisplayFeature.SongNameSelector).html(content.name);
            $(SongDisplayFeature.SongArtistSelector).html(content.artists.map(function(artist) { return artist.name; }).join(", "));
            $(SongDisplayFeature.PlaylistImageSelector).attr("src", content.album.image);
        }
    }
}
