/**
 * Mshuffle type aliases and interfaces
 */

import {Authorization, Id, Identifiable} from "./auth";

import {BaseCollectiveDataStore, IdToNumber, PMFData, Probabilities} from "./data";

import {RequestError, RequestSuccess} from "./http";

import {MusicAPI, Playlist, Song} from "./music";


/**
 * Abstract class for Mshuffle's API
 */
export abstract class BaseMshuffleAPI {
    /**
     * Listening Features
     */
    protected listeningFeatures: ListeningFeature[];

    /**
     * Listening Sessions
     */
    protected listeningSessions: ListeningSessions;

    /**
     * Create an instance of a BaseMshuffleAPI
     * @param musicAPI Music API
     * @param collectiveDataStore Collective Data Store
     */
    constructor(protected musicAPI: MusicAPI, protected collectiveDataStore: BaseCollectiveDataStore) {
        this.listeningFeatures = [];
        this.listeningSessions = {};
    }

    /**
     * Create a new Listening Session for the user
     * @param auth Authorization
     * @param playlist Playlist
     */
    abstract createListeningSession(auth: Authorization, playlist: Playlist): void;

    /**
     * Delete a Listening Session for the user
     * @param auth Authorization
     */
    abstract deleteListeningSession(auth: Authorization): void;

    /**
     * Dislike the current song
     * @param auth Authorization
     * @param success RequestSuccess
     * @param error RequestError
     */
    abstract dislike(auth: Authorization, success: RequestSuccess, error: RequestError): void;

    /**
     * Enjoy the current song
     * @param auth Authorization
     * @param success RequestSuccess
     * @param error RequestError
     */
    abstract enjoy(auth: Authorization, success: RequestSuccess, error: RequestError): void;

    /**
     * Get user's Listening Session
     * @param auth Authorization
     * @returns Listening Session or null
     */
    abstract getListeningSession(auth: Authorization): ListeningSession | null;

    /**
     * Get the music API being used by Mshuffle
     */
    getMusicAPI(): MusicAPI {
        return this.musicAPI;
    }

    /**
     * Get a PMF for the user's Listening Session
     * @param auth Authorization
     * @returns PMFData or null
     */
    abstract getPMF(auth: Authorization): PMFData | null;

    /**
     * Get the next song for the user's Listening Session
     * @param auth Authorization
     * @returns Identifiable or null
     */
    abstract next(auth: Authorization): Identifiable | null;

    /**
     * Skip the current song for the user's Listening Session
     * @param auth Authorization
     * @returns Identifiable or null
     */
    abstract skip(auth: Authorization): Identifiable | null;
}

/**
 * Abstract class for a Listening Feature
 */
export abstract class ListeningFeature implements Identifiable {
    /**
     * Create an instance of a Listening Feature with an id
     * @param id Id of feature
     */
    constructor(public readonly id: Id) {
    }

    /**
     * Load the feature for the given Listening Session
     * @param listeningSession Listening Session to act on
     * @param collectiveDataStore Collective Data Store to store/retrieve
     * @param data Optional data that may be needed for initialization
     */
    load(listeningSession: ListeningSession, collectiveDataStore: BaseCollectiveDataStore, data?: any): void {
    }

    /**
     * Dislike functionality for the Listening Feature
     * @param listeningSession Listening Session to act on
     * @param collectiveDataStore Collective Data Store to store/retrieve
     */
    dislike(listeningSession: ListeningSession, collectiveDataStore: BaseCollectiveDataStore): void {
    }
    
    /**
     * Enjoy functionality for the Listening Feature
     * @param listeningSession Listening Session to act on
     * @param collectiveDataStore Collective Data Store to store/retrieve
     */
    enjoy(listeningSession: ListeningSession, collectiveDataStore: BaseCollectiveDataStore): void {
    }

    /**
     * Next functionality for the Listening Feature
     * @param listeningSession Listening Session to act on
     * @param collectiveDataStore Collective Data Store to store/retrieve
     */
    next(listeningSession: ListeningSession, collectiveDataStore: BaseCollectiveDataStore): void {
    }

    /**
     * Skip functionality for the Listening Feature
     * @param listeningSession Listening Session to act on
     * @param collectiveDataStore Collective Data Store to store/retrieve
     */
    skip(listeningSession: ListeningSession, collectiveDataStore: BaseCollectiveDataStore): void {
    }
}

/**
 * Data for a Listening Feature, stored in a Listening Session
 */
export interface ListeningFeatureSession extends Identifiable {
}

/**
 * Indexer for Listening Feature Sessions for data
 */
export interface ListeningFeatureSessions {
    [index: string]: ListeningFeatureSession;
}

/**
 * Listening Session data for an mshuffle listening Session
 * on a playlist
 */
export interface ListeningSession extends Identifiable {
    /**
     * Data stored for Listening Features for this particular
     * Listening Session
     */
    listeningFeatureSessions: ListeningFeatureSessions;

    /**
     * Playlist for the Listening Session
     */
    playlist: Playlist;

    /**
     * Song Probabilities
     */
    probabilities: Probabilities;

    /**
     * Current Song
     */
    currentSong: Song | null;

    /**
     * Song id to index
     */
    songIndex: IdToNumber;
}

/**
 * Indexer for Listening Sessions
 */
export interface ListeningSessions {
    [index: string]: ListeningSession;
}

/**
 * Abstract class for interacting with the Mshuffle server
 * from the site
 */
export abstract class MshuffleClientAPI {
    /**
     * Create an instance of a MshuffleClientAPI
     */
    constructor() {
    }

    /**
     * Play music
     */
    abstract play(): void;

    /**
     * Stop music
     */
    abstract stop(): void;

    /**
     * Get the next song and play it
     */
    abstract next(): void;

    /**
     * Skip to the next song and play it
     */
    abstract skip(): void;

    /**
     * Let mshuffle know that you enjoy the current song
     */
    abstract enjoy(): void;

    /**
     * Let mshuffle know that you dislike the current song
     */
    abstract dislike(): void;

    /**
     * Get the PMF for the current listening session for visualization
     */
    abstract getPMF(): void;

    /**
     * Get the playlist
     * @param ownerId Owner Id
     * @param playlistId Playlist Id
     */
    abstract getPlaylist(ownerId: Id, playlistId: Id): void;

    /**
     * Get the user's playlists
     */
    abstract getPlaylists(): void;

    /**
     * Get User information
     */
    abstract getUser(): void;
}
