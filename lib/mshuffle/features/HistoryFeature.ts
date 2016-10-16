import {BaseHistoryFeature, Capacity, HistoryQueue} from "../../../shared/features/history";
import {ListeningFeatureSession, ListeningSession} from "../../../shared/mshuffle";

import {BaseCollectiveDataStore} from "../../../shared/data";

import {Id} from "../../../shared/auth";


/**
 * History Feature for mshuffle to store a queue
 * of songs with temporary probability 0
 */
export default class HistoryFeature extends BaseHistoryFeature {
    /**
     * History Feature Id
     */
    public static HistoryFeatureId = "History";

    /**
     * Default History Queue Size
     * If < 1, proportion of songs, else num songs
     */
    public static DefaultHistoryQueueSize = 0.15;

    /**
     * Create an instance of a HistoryFeature
     */
    constructor() {
        super(HistoryFeature.HistoryFeatureId);
    }

    /**
     * Load the History Feature for the given Listening Session
     * @param listeningSession Listening Session to act on
     * @param collectiveDataStore Collective Data Store to store/retrieve
     * @param data Optional Capacity
     */
    load(listeningSession: ListeningSession, collectiveDataStore: BaseCollectiveDataStore, data?: any): void {
        super.load(listeningSession, collectiveDataStore);

        let sessionData: HistoryQueue = {
            id: this.id,
            queue: [],
            set: {},
            capacity: this.determineCapacity(
                Capacity.IsCapacity(data) ? data.capacity : HistoryFeature.DefaultHistoryQueueSize,
                listeningSession.playlist.songs.length),
            storedSongProbabilities: {}
        };

        listeningSession.listeningFeatureSessions[this.id] = sessionData;
    }

    /**
     * Next functionality for the History Feature
     * @param listeningSession Listening Session to act on
     * @param collectiveDataStore Collective Data Store to store/retrieve
     */
    next(listeningSession: ListeningSession, collectiveDataStore: BaseCollectiveDataStore): void {
        super.next(listeningSession, collectiveDataStore);

        this.push(listeningSession);
    }

    /**
     * Pop from the queue
     * @param listeningSession Listening Session
     */
    pop(listeningSession: ListeningSession): void {
        // Check type guard
        let historyQueue: ListeningFeatureSession = listeningSession.listeningFeatureSessions[this.id];
        if (!HistoryQueue.IsHistoryQueue(historyQueue)) {
            console.error(`Listening Session does not have a HistoryQueue keyed by ${this.id} that can be used in pop()`);
            return;
        }

        // Cannot pop from an empty array, just return user's session
        if (historyQueue.queue.length === 0) {
            console.error("Cannot pop() from an empty HistoryQueue");
            return;
        }

        // Remove one song from the top
        let removed = historyQueue.queue.splice(0, 1);

        // Remove songs
        for (let songId of removed) {
            // console.log("Removing " + songId + " from queue");
            // Clear the set of those removed
            delete historyQueue.set[songId];
            // Restore the probability of the song
            this.restoreProbability(listeningSession, historyQueue, songId);
        }
    }

    /**
     * Push to the queue
     * @param listeningSession Listening Session
     */
    push(listeningSession: ListeningSession): void {
        // Check type guard
        let historyQueue: ListeningFeatureSession = listeningSession.listeningFeatureSessions[this.id];
        if (!HistoryQueue.IsHistoryQueue(historyQueue)) {
            console.error(`Listening Session does not have a HistoryQueue keyed by ${this.id} that can be used in push()`);
            return;
        }

        // Ignore if no current song or history queue already has song, just return user's session
        let currentSong = listeningSession.currentSong;
        if (currentSong === null || historyQueue.set[currentSong.id] !== undefined) {
            console.error(`Listening Session has no current song to push() or song is already in queue`);
            return;
        }

        // If queue is at capacity, pop from the top
        if (historyQueue.queue.length === historyQueue.capacity) {
            this.pop(listeningSession);
        }

        // Add to queue and map (for quickly checking containment)
        historyQueue.queue.push(currentSong.id);
        historyQueue.set[currentSong.id] = true;

        // Store the song's probability and set to 0
        historyQueue.storedSongProbabilities[currentSong.id] = listeningSession.probabilities[currentSong.id].value
        listeningSession.probabilities[currentSong.id].value = 0.0;
    }

    /**
     * Determine the capacity to load
     * @param queueSize If < 1, proportion of songs, else num songs
     * @param numSongs Number of songs used for proportion sized queues 
     * @returns Number of songs that can be held in the queue
     */
    private determineCapacity(queueSize: number, numSongs: number): number {
        return (queueSize < 1) ? Math.round(queueSize * numSongs) : queueSize;
    }

    /**
     * Restore the song's probability
     * @param listeningSession Listening Session
     * @param historyQueue History Queue
     * @param songId Id of the song to restore
     */
    private restoreProbability(listeningSession: ListeningSession, historyQueue: HistoryQueue, songId: Id): void {
        // P(Song) = 1 / n (0 if n = 0)
        // let numSongs = listeningSession.playlist.songs.length;
        // listeningSession.probabilitiies[songId].value = (numSongs > 0) ? (1 / numSongs) : 0;

        // P(Song) = probability prior to history queue
        // console.log(`Restoring prob: ${historyQueue.storedSongProbabilities[songId]}`);
        listeningSession.probabilities[songId].value = historyQueue.storedSongProbabilities[songId];
        delete historyQueue.storedSongProbabilities[songId];
    }
}
