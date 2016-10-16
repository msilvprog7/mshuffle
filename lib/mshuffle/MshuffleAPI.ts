import {BaseMshuffleAPI, ListeningFeature, ListeningSession, ListeningSessions} from "../../shared/mshuffle";
import HistoryFeature from "./features/HistoryFeature";
import SatisfactionFeature from "./features/SatisfactionFeature";

import {Artist, MusicAPI, Playlist, Song} from "../../shared/music";
import SpotifyAPI from "../music/spotify/SpotifyAPI";

import {Authorization, Id, Identifiable} from "../../shared/auth";

import {CollectiveData, LabeledDataValue, PMFData, StringSet} from "../../shared/data";
import CollectiveDataStore from "../data/CollectiveDataStore";
import StringSetCollectiveDataValue from "../data/StringSetCollectiveDataValue";

import {RequestError, RequestSuccess} from "../../shared/http";


/**
 * Mshuffle API
 */
export default class MshuffleAPI extends BaseMshuffleAPI {
    /**
     * Listening Features
     */
    protected listeningFeatures: ListeningFeature[];

    /**
     * Listening Sessions
     */
    protected listeningSessions: ListeningSessions;

    /**
     * Music API
     */
    protected musicAPI: MusicAPI;

    /**
     * Create an instance of a BaseMshuffleAPI
     * @param musicAPI MusicAPI
     * @param listeningFeatures Listening Features
     * @param listeningSessions Listening Sessions
     */
    constructor() {
        super(new SpotifyAPI(), MshuffleAPI.initializeCollectiveDataStore());
        
        // Add Listening Features
        this.listeningFeatures.push(new HistoryFeature());
        this.listeningFeatures.push(new SatisfactionFeature());
    }

    /**
     * Create a new Listening Session for the user
     * @param auth Authorization
     * @param playlist Playlist
     */
    createListeningSession(auth: Authorization, playlist: Playlist): void {
        let authKey: string = Authorization.Hash(auth);

        // Create session
        let listeningSession: ListeningSession = {
            id: authKey,
            listeningFeatureSessions: {},
            playlist: playlist,
            probabilities: {},
            currentSong: null,
            songIndex: {}
        };

        // Load song data (probabilities, etc.)
        if (playlist.songs !== null) {
            let equalOdds = (playlist.songs.length > 0) ? (1 / playlist.songs.length) : 0;
            playlist.songs.forEach(function (song: Song, index: number) {
                // Add probabilities
                let probability: LabeledDataValue = {
                    label: `'${song.name}' by ${song.artists.map(artist => artist.name).join(", ")}`,
                    value: equalOdds
                };
                listeningSession.probabilities[song.id] = probability;

                // Add Id => index
                listeningSession.songIndex[song.id] = index;
            });
        }

        // Load session features
        this.listeningFeatures.forEach(feature => feature.load(listeningSession, this.collectiveDataStore));
        
        // Store
        this.listeningSessions[authKey] = listeningSession;
    }

    /**
     * Get user's Listening Session
     * @param auth Authorization
     * @returns Listening Session or null
     */
    getListeningSession(auth: Authorization): ListeningSession | null {
        let authKey: string = Authorization.Hash(auth);
        let session = this.listeningSessions[authKey];

        if (session === undefined) {
            return null;
        }

        return session;
    }

    /**
     * Delete a Listening Session for the user
     * @param auth Authorization
     */
    deleteListeningSession(auth: Authorization): void {
        let authKey: string = Authorization.Hash(auth);
        delete this.listeningSessions[authKey];
    }

    /**
     * Dislike the current song
     * @param auth Authorization
     * @param success RequestSuccess
     * @param error RequestError
     */
    dislike(auth: Authorization, success: RequestSuccess, error: RequestError): void {
        let authKey: string = Authorization.Hash(auth);
        let session = this.listeningSessions[authKey];

        if (session.currentSong !== null) {
            this.getSimilarArtists(
                auth,
                session,
                RequestSuccess.make(function (data?: any): void {
                     // Send session to features
                    this.listeningFeatures.forEach(feature => feature.dislike(session, this.collectiveDataStore));

                    // Normalize probabilities
                    this.normalize(session);

                    // Get PMF
                    success.success(this.getPMF(auth));
                }.bind(this)),
                error);
        } else {
            error.error(409, "Cannot dislike a non-existant song");
        }
    }

    /**
     * Enjoy the current song
     * @param auth Authorization
     * @param success RequestSuccess
     * @param error RequestError
     */
    enjoy(auth: Authorization, success: RequestSuccess, error: RequestError): void {
        let authKey: string = Authorization.Hash(auth);
        let session = this.listeningSessions[authKey];

        if (session.currentSong !== null) {
            this.getSimilarArtists(
                auth,
                session,
                RequestSuccess.make(function (data?: any): void {
                     // Send session to features
                    this.listeningFeatures.forEach(feature => feature.enjoy(session, this.collectiveDataStore));

                    // Normalize probabilities
                    this.normalize(session);

                    // Get PMF
                    success.success(this.getPMF(auth));
                }.bind(this)),
                error);
        } else {
            error.error(409, "Cannot enjoy a non-existant song");
        }
    }

    /**
     * Get a PMF for the user's Listening Session
     * @param auth Authorization
     * @returns PMFData or null
     */
    getPMF(auth: Authorization): PMFData | null {
        let authKey: string = Authorization.Hash(auth);
        let session = this.listeningSessions[authKey];
        
        if (session === undefined || session === null) {
            return null;
        }
        
        let pmf: PMFData = {
            data: Object.keys(session.probabilities).map(songId => session.probabilities[songId])
        }
        return pmf;
    }

    /**
     * Get the next song for the user's Listening Session
     * @param auth Authorization
     * @returns Identifiable or null
     */
    next(auth: Authorization): Identifiable | null {
        let authKey: string = Authorization.Hash(auth);
        let session = this.listeningSessions[authKey];

        // Send session to features
        this.listeningFeatures.forEach(feature => feature.next(session, this.collectiveDataStore));

        // Normalize probabilities
        this.normalize(session);

        // Pick a new song
        return this.selectSong(session);
    }

    /**
     * Skip the current song for the user's Listening Session
     * @param auth Authorization
     * @returns Identifiable or null
     */
    skip(auth: Authorization): Identifiable | null {
        // Future: at some point it may be nice
        // to dislike by some factor, but currently
        // this is not an obvious need

        // Get the next track
        return this.next(auth);
    }

    /**
     * Get similar artists to the user's current song and 
     * put them in the collective data store if not already there
     * @param auth Authorization
     * @param listeningSession User's Listening Session
     * @param success Request Success
     * @param error Request Error
     */
    private getSimilarArtists(auth: Authorization, listeningSession: ListeningSession, success: RequestSuccess, error: RequestError): void {
        this.recursivelyGetSimilarArtists(auth, listeningSession.currentSong.artists.slice(0), success, error);
    }

    /**
     * Get similar artists to the user's current song recursively,
     * where responses are stored in the collective data store and
     * failures are okay
     * @param auth Authorization
     * @param artists Artists 
     * @param success Request Success
     * @param error Request Error
     */
    private recursivelyGetSimilarArtists(auth: Authorization, artists: Artist[], success: RequestSuccess, error: RequestError): void {
        switch (artists.length) {
            case 0:
                success.success();
                break;
            default:
                let artist = artists.splice(0, 1)[0];
                
                this.musicAPI.getSimilarArtists(
                    auth, 
                    artist.id, 
                    RequestSuccess.make(function (data?: any): void {
                        if (Artist.AreArtists(data)) {
                            // Add to string set
                            let similarArtistsStringSet: StringSet = {};
                            data.forEach(artist => similarArtistsStringSet[artist.id] = true);

                            // Add to collective data store
                            let similarArtists: StringSetCollectiveDataValue = new StringSetCollectiveDataValue(artist.id, similarArtistsStringSet);
                            this.collectiveDataStore.put(CollectiveDataStore.SimilarArtistsId, similarArtists);
                        }

                        // Continue to get the similar artists for the next song artist
                        this.recursivelyGetSimilarArtists(auth, artists, success, error);
                    }.bind(this)),
                    RequestError.make(function (statusCode: number, errorMessage: string): void {
                        // It's okay to fail, keep going
                        this.recursivelyGetSimilarArtists(auth, artists, success, error);
                    }.bind(this)));
                break;
        }
    }

    /**
     * Normalize the probabilities in the listening session so their
     * total probability equals 1
     * @param listeningSession User's Listening Session
     */
    private normalize(listeningSession: ListeningSession): void {
        let totalProbability = Object.keys(listeningSession.probabilities).reduce(
            (prev: number, songId: Id) => prev + listeningSession.probabilities[songId].value, 0.0);
        
        // If total probability is less than or equal to 0, end early
        if (totalProbability <= 0) {
            return;
        }

        // Divide all probabilities by the total probability
        Object.keys(listeningSession.probabilities).forEach(function (songId: Id) {
            listeningSession.probabilities[songId].value /= totalProbability;
        });
    }

    /**
     * Accumulate probabilities for random probability and
     * assign current song
     * @param listeningSession User's Listening Session
     * @returns Song selected or null
     */
    private selectSong(listeningSession: ListeningSession): Song | null {
        let accum = 0;
        let prob = Math.random();

        for (let songId of Object.keys(listeningSession.probabilities)) {
            accum += listeningSession.probabilities[songId].value;

            // Selection criteria: accumulator exceeds random probability
            if (accum > prob) {
                listeningSession.currentSong = listeningSession.playlist.songs[listeningSession.songIndex[songId]];
                return listeningSession.currentSong;
            }
        }

        return null;
    }

    /**
     * Initialize a Collective Data Store usable by the Mshuffle API
     */
    private static initializeCollectiveDataStore(): CollectiveDataStore {
        let store = new CollectiveDataStore();
        
        // Artist => Similar ArtistSongsId
        store.set(new CollectiveData(CollectiveDataStore.SimilarArtistsId));
        
        return store;
    }
}
