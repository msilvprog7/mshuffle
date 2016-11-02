/**
 * Mock data for history related interfaces
 */
import {SatisfactionAdjustmentFactor, SatisfactionAdjustmentFactorSet, SatisfactionSessionData} from "../../../shared/features/satisfaction";

import {Song} from "../../../shared/music";

import {IdToStringSet} from "../../../shared/data";

import {Id} from "../../../shared/auth";


/**
 * SatisfactionAdjustmentFactor mocks
 */
export class MockSatisfactionAdjustmentFactor {
    /**
     * Make a SatisfactionAdjustmentFactor mock
     */
    public static make(
        enjoy: (song: Song, probability: number) => number, 
        dislike: (song: Song, probability: number) => number): SatisfactionAdjustmentFactor {

        return {
            enjoy: enjoy,
            dislike: dislike
        };
    }

    /**
     * Make a SatisfactionAdjustmentFactor mock that returns
     * a fixed probability value (negative for dislike)
     */
    public static makeFixedProb(prob: number): SatisfactionAdjustmentFactor {
        return MockSatisfactionAdjustmentFactor.make(
            (song: Song, probability: number) => prob,
            (song: Song, probability: number) => -prob);
    }
}

/**
 * SatisfactionAdjustmentFactorSet mocks
 */
export class MockSatisfactionAdjustmentFactorSet {
    /**
     * Make a SatisfactionAdjustmentFactorSet mock
     */
    public static make(
        song: SatisfactionAdjustmentFactor,
        album: SatisfactionAdjustmentFactor,
        artist: SatisfactionAdjustmentFactor,
        similarArtist: SatisfactionAdjustmentFactor): SatisfactionAdjustmentFactorSet {

        return {
            song: song,
            album: album,
            artist: artist,
            similarArtist: similarArtist
        };
    }

    /**
     * Make a SatisfactionAdjustmentFactorSet mock that returns
     * a fixed probability value (negative for dislike) for every
     * adjustment factor
     */
    public static makeFixedProb(prob: number): SatisfactionAdjustmentFactorSet {
        let fixedFactor = MockSatisfactionAdjustmentFactor.make(
            (song: Song, probability: number) => prob,
            (song: Song, probability: number) => -prob);
        
        return {
            song: fixedFactor,
            album: fixedFactor,
            artist: fixedFactor,
            similarArtist: fixedFactor
        };
    }
}

/**
 * SatisfactionSessionData mocks
 */
export class MockSatisfactionSessionData {
    /**
     * Make a SatisfactionSessionData mock
     */
    public static make(
        id: Id,
        adjustments: SatisfactionAdjustmentFactorSet,
        albumSongs: IdToStringSet,
        artistSongs: IdToStringSet): SatisfactionSessionData {

        return {
            id: id,
            adjustments: adjustments,
            albumSongs: albumSongs,
            artistSongs: artistSongs
        };
    }
}
