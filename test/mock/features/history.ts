/**
 * Mock data for history related interfaces
 */
import {Capacity, HistoryQueue} from "../../../shared/features/history";

import {IdToNumber, StringSet} from "../../../shared/data";

import {Id} from "../../../shared/auth";


/**
 * History queue mocks
 */
export class MockHistoryQueue {
    /**
     * Make a history queue mock
     */
    public static make(id: Id, queue: Id[], set: StringSet, capacity: number, storedSongProbabilities: IdToNumber): HistoryQueue {
        return {
            id: id,
            queue: queue,
            set: set,
            capacity: capacity,
            storedSongProbabilities: storedSongProbabilities
        };
    }
}

/**
 * Capacity mocks
 */
export class MockCapacity {
    /**
     * Make a capacity mock
     */
    public static make(capacity: number): Capacity {
        return {
            capacity: capacity
        };
    }
}
