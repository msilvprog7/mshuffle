/**
 * Mock data for data related interfaces
 */

import {IdToNumber, LabeledDataValue, Probabilities} from "../../shared/data";

import {Song} from "../../shared/music";

import {Id} from "../../shared/auth";


/**
 * Id mapping mocks
 */
export class MockIdMapping {
    /**
     * Make an id mapping mock based on songs
     */
    public static makeWithSongs(songs: Song[] | null): IdToNumber {
        if (songs === null) {
            return {};
        }
        
        let songIndex: IdToNumber = {};
        songs.forEach(function (song: Song, index: number) {
                songIndex[song.id] = index;
            });

        return songIndex;
    }
}

/**
 * Probability mocks
 */
export class MockProbability {
    /**
     * Make a probabilities mock based on songs
     */
    public static makeWithSongs(songs: Song[] | null): Probabilities {
        if (songs === null) {
            return {};
        }

        let equalOdds = (songs.length > 0) ? (1 / songs.length) : 0,
            probs: Probabilities = {};
            
        songs.forEach(function (song: Song) {
                probs[song.id] = {
                    label: song.name,
                    value: equalOdds
                };
            });

        return probs;   
    }
}
