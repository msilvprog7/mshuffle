import {DisplayFeature} from "../../../shared/display";

import {User} from "../../../shared/auth";

import * as $ from "jquery";


/**
 * Display Feature for managing site content for a user's
 * information
 */
export default class UserDisplayFeature extends DisplayFeature {
    /**
     * Static Id
     */
    public static DisplayFeatureId = "User";
    
    /**
     * Selector for displaying the user's firstname
     */
    private static FirstnameSelector = "[name='firstname']";

    /**
     * Create an instance of UserInfoDisplayFeature
     */
    constructor() {
        super(UserDisplayFeature.DisplayFeatureId);
    }

    /**
     * Set user information from music service
     * @param content User
     */
    fill(content: any): void {
        super.fill(content);

        if (User.IsUser(content)) {
            $(UserDisplayFeature.FirstnameSelector).html(content.fullname.split(/\s+/g)[0]);
        }
    }
}
