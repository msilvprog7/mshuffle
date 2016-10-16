/**
 * Audio type aliases and interfaces
 */

import {uri} from "./http";


/**
 * Abstract class for site's use of Audio
 */
export abstract class AudioAPI {
    /**
     * Creates an instance of an Audio API
     */
    constructor() {
    }

    /**
     * Load audio from the url, call callback when
     * finished
     */
    abstract load(url: uri, callback?: any): void;

    /**
     * Pause loaded audio
     */
    abstract pause(): void;

    /**
     * Play loaded audio
     */
    abstract play(): void;
}
