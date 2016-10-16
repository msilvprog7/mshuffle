/**
 * Mshuffle History Listening Feature type aliases and interfaces
 */

import {ListeningFeature, ListeningFeatureSession, ListeningSession} from "../mshuffle";

import {Id, Identifiable} from "../auth";

import {IdToNumber, StringSet} from "../data";


/**
 * Abstract class for the History Listening Feature
 */
export abstract class BaseHistoryFeature extends ListeningFeature {
    /**
     * Create an instance of a BaseHistoryFeature
     */
    constructor(readonly id: Id) {
        super(id);
    }

    /**
     * Pop from the queue
     * @param listeningSession Listening Session
     */
    abstract pop(listeningSession: ListeningSession): void;

    /**
     * Push to the queue
     * @param listeningSession Listening Session
     */
    abstract push(listeningSession: ListeningSession): void;
}

/**
 * Interface for a history queue, which stores History related
 * data for a User's listening session
 */
export interface HistoryQueue extends ListeningFeatureSession {
    /**
     * Queue for Song Ids
     */
    queue: Id[];

    /**
     * Set used to quickly check queue containment
     */
    set: StringSet;

    /**
     * History queue's capacity
     */
    capacity: number;

    /**
     * Stored song probabilities on push to queue
     */
    storedSongProbabilities: IdToNumber;
}

export class HistoryQueue {
    public static IsHistoryQueue(queue: any): queue is HistoryQueue {
        return (queue !== undefined &&
            queue !== null &&
            "queue" in queue &&
            Identifiable.AreIds(queue.queue) &&
            "set" in queue &&
            "capacity" in queue &&
            "storedSongProbabilities" in queue);
    }
}

/**
 * Capacity wrapper for more formalized use cases
 */
export interface Capacity {
    /**
     * History queue's capacity
     */
    capacity: number;
}

/**
 * Static methods for Capacity
 */
export class Capacity {
    /**
     * Capacity's type guard
     * @param capacity Potential capacity
     * @returns Whether or not it is a Capacity
     */
    public static IsCapacity(capacity: any): capacity is Capacity {
        return (capacity !== undefined &&
            capacity !== null &&
            "capacity" in capacity);
    }
}
