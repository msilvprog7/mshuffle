import {DisplayFeature} from "../../../shared/display";
import * as $ from "jquery";


/**
 * Display Feature for toggling the play button between
 * when playing music or not
 */
export default class PlayButtonToggleDisplayFeature extends DisplayFeature {
    /**
     * Static Id
     */
    public static DisplayFeatureId = "Play";
    
    /**
     * Selector for a play button
     */
    private static PlayButtonSelector = ".mshuffle-play";

    /**
     * Create instance of a PlayButtonToggleDisplayFeature
     */
    constructor() {
        super(PlayButtonToggleDisplayFeature.DisplayFeatureId);
    }

    /**
     * Fill with appropriate button, pause if playling, play if paused
     * @param content boolean for whether or not playing music
     */
    fill(content: any): void {
        super.fill(content);
        
        if (typeof(content) === "boolean" && content) {
            // To pause icon
            $(PlayButtonToggleDisplayFeature.PlayButtonSelector).html("<i class='fa fa-pause'></i>");
        } else {
            // To play icon
            $(PlayButtonToggleDisplayFeature.PlayButtonSelector).html("<i class='fa fa-play'></i>");
        }
    }
}
