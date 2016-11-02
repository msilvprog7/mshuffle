/**
 * Mshuffle Satisfaction Listening Feature type aliases and interfaces
 */

import {ListeningFeature, ListeningFeatureSession} from "../mshuffle";

import {Song} from "../music";

import {IdToStringSet} from "../data";

import {Id} from "../auth";


/**
 * Abstract class for the Satisfaction Listening Feature
 */
export abstract class BaseSatisfactionFeature extends ListeningFeature {
    /**
     * Create an instance of a BaseSatisfactionFeature
     */
    constructor(readonly id: Id) {
        super(id);
    }
}

/**
 * Interface for adjusting a user's satisfaction 
 * with a Song
 */
export interface SatisfactionAdjustmentFactor {
    /**
     * Function to get the adjusted probability of a Song
     * after a User enjoys the Song
     */
    enjoy(song: Song, probability: number): number;

    /**
     * Function to get the adjusted probability of a Song
     * after a User dislikes the Song
     */
    dislike(song: Song, probability: number): number;
}

/**
 * Static methods for a SatisfactionAdjustmentFactor
 */
export class SatisfactionAdjustmentFactor {
    /**
     * SatisfactionAdjustmentFactor's type guard
     */
    public static IsSatisfactionAdjustmentFactor(factor: any): factor is SatisfactionAdjustmentFactor {
        return (factor !== undefined &&
            factor !== null &&
            typeof(factor) === "object" &&
            "enjoy" in factor &&
            typeof(factor.enjoy) === "function" &&
            "dislike" in factor &&
            typeof(factor.dislike) === "function");
    }
}

/**
 * Set of SatisfactionAdjustmentFactor to apply based on a song
 */
export interface SatisfactionAdjustmentFactorSet {
    /**
     * Functions to adjust current song's probability
     */
    song: SatisfactionAdjustmentFactor;

    /**
     * Functions to adjust probability for songs on the
     * same album as the current song
     */
    album: SatisfactionAdjustmentFactor;

    /**
     * Functions to adjust probability for songs by the
     * same artist as the current song
     */
    artist: SatisfactionAdjustmentFactor;

    /**
     * Functions to adjust probability for songs by 
     * similar artists
     */
    similarArtist: SatisfactionAdjustmentFactor;
}

/**
 * Static methods for SatisfactionAdjustmentFactorSets
 */
export class SatisfactionAdjustmentFactorSet {
    /**
     * SatisfactionAdjustmentFactorSet's type guard
     */
    public static IsSatisfactionAdjustmentFactorSet(factors: any): factors is SatisfactionAdjustmentFactorSet {
        return (factors !== undefined &&
            factors !== null &&
            typeof(factors) === "object" &&
            "song" in factors &&
            SatisfactionAdjustmentFactor.IsSatisfactionAdjustmentFactor(factors.song) && 
            "album" in factors &&
            SatisfactionAdjustmentFactor.IsSatisfactionAdjustmentFactor(factors.album) && 
            "artist" in factors &&
            SatisfactionAdjustmentFactor.IsSatisfactionAdjustmentFactor(factors.artist) && 
            "similarArtist" in factors &&
            SatisfactionAdjustmentFactor.IsSatisfactionAdjustmentFactor(factors.similarArtist));
    }
}

/**
 * Session data to store for a user of the satisfaction feature
 */
export interface SatisfactionSessionData extends ListeningFeatureSession {
    /**
     * Probability adjustment factors to apply for satisfaction
     */
    adjustments: SatisfactionAdjustmentFactorSet;

    /**
     * Mapping from album id to a set of song ids
     */
    albumSongs: IdToStringSet;

    /**
     * Mapping from artist id to a set of song ids
     */
    artistSongs: IdToStringSet;
}

/**
 * Statis methods for a SatisfactionSessionData
 */
export class SatisfactionSessionData {
    /**
     * SatisfactionSessionData's type guard
     */
    public static IsSatisfactionSessionData(data: any): data is SatisfactionSessionData {
        return (data !== undefined &&
            data !== null &&
            typeof(data) === "object" &&
            "adjustments" in data &&
            SatisfactionAdjustmentFactorSet.IsSatisfactionAdjustmentFactorSet(data.adjustments) &&
            "albumSongs" in data &&
            IdToStringSet.IsIdToStringSet(data.albumSongs) &&
            "artistSongs" in data &&
            IdToStringSet.IsIdToStringSet(data.artistSongs));
    }
}
