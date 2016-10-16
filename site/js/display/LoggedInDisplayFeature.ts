import {DisplayFeature} from "../../../shared/display";
import {Id} from "../../../shared/auth";
import * as $ from "jquery";


/**
 * Display Feature for managing site content when a user
 * is logged in or logged out
 */
export default class LoggedInDisplayFeature extends DisplayFeature {
    /**
     * Static Id
     */
    public static DisplayFeatureId = "LoggedIn";

    /**
     * Selector to display for logged in scenarios
     */
    public static LoggedInSelector = ".logged-in";

    /**
     * Selector to display for logged out scenarios
     */
    public static LoggedOutSelector = ".not-logged-in";

    /**
     * Create an instance of LoggedInDisplayFeature
     */
    constructor() {
        super(LoggedInDisplayFeature.DisplayFeatureId);
    }

    /**
     * Hide LoggedInDisplayFeature
     */
    hide(): void {
        super.hide();
        $(LoggedInDisplayFeature.LoggedInSelector).hide();
        $(LoggedInDisplayFeature.LoggedOutSelector).show();
    }

    /**
     * Show LoggedInDisplayFeature
     */
    show(): void {
        super.show();
        $(LoggedInDisplayFeature.LoggedOutSelector).hide();
        $(LoggedInDisplayFeature.LoggedInSelector).show();
    }
}
