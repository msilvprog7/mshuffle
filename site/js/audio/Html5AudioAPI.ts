import {AudioAPI} from "../../../shared/audio";
import {uri} from "../../../shared/http";


/**
 * API for playing audio using an Html 5's Audio
 * Element
 */
export default class Html5AudioAPI extends AudioAPI {

    /**
     * Audio currently loaded
     */
    private audio: HTMLAudioElement | null = null;

    /**
     * Creates an instance of an Html5AudioAPI
     */
    constructor() {
        super();
    }

    /**
     * Load audio from the url, call callback when
     * finished
     * @url URL for the audio
     * @callback Callback once the audio is finished playing
     */
    load(url: uri, callback?: any): void {
        // Stop and remove previous
        if (this.audio !== null) {
            this.audio.pause();
            this.audio = null;
        }

        this.audio = new Audio();
        this.audio.src = url;
        this.audio.loop = false;
        this.audio.onended = callback;
    }

    /**
     * Pause the loaded audio
     */
    pause(): void {
        if (this.audio === null) {
            return;
        }

        this.audio.pause();
    }

    /**
     * Play the loaded audio
     */
    play(): void {
        if (this.audio === null) {
            return;
        }
        
        this.audio.play();
    }
}
