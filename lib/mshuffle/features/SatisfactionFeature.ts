import {BaseSatisfactionFeature, SatisfactionAdjustmentFactorSet, SatisfactionSessionData} from "../../../shared/features/satisfaction";
import {ListeningFeatureSession, ListeningSession} from "../../../shared/mshuffle";

import {Album, Artist, Song} from "../../../shared/music";

import {BaseCollectiveDataStore, CollectiveDataValue, IdToStringSet, StringSet} from "../../../shared/data";
import CollectiveDataStore from "../../data/CollectiveDataStore";
import StringSetCollectiveDataValue from "../../data/StringSetCollectiveDataValue";

import {Id} from "../../../shared/auth";


/**
 * Satisfaction Feature for adjusting probabilities based
 * on enjoy/dislike
 */
export default class SatisfactionFeature extends BaseSatisfactionFeature {
    /**
     * Satisfaction Feature Id
     */
    public static SatisfactionFeatureId = "Satisfaction";

    /**
     * Create an instance of a SatisfactionFeature
     */
    constructor() {
        super(SatisfactionFeature.SatisfactionFeatureId);
    }

    /**
     * Load the Satisfaction Feature for the given Listening Session
     * @param listeningSession Listening Session to act on
     * @param collectiveDataStore Collective Data Store to store/retrieve
     * @param data Optional Adjustment factors
     */
    load(listeningSession: ListeningSession, collectiveDataStore: BaseCollectiveDataStore, data?: any): void {
        super.load(listeningSession, collectiveDataStore);

        // Default: enjoy + 1/n, dislike - 1/n
        let equalProb = (listeningSession.playlist.songs.length > 0) ? 
            (1 / listeningSession.playlist.songs.length) : 0;
        let defaultEnjoy = (song: Song, probability: number) => 
            probability + Math.max(equalProb, -probability);
        let defaultDislike = (song: Song, probability: number) => 
            probability + Math.max(-equalProb, -probability);
        
        let adjustments: SatisfactionAdjustmentFactorSet;
        if (SatisfactionAdjustmentFactorSet.IsSatisfactionAdjustmentFactorSet(data)) {
            adjustments = data;
        } else {
            adjustments = {
                song: { enjoy: defaultEnjoy, dislike: defaultDislike },
                album: { enjoy: defaultEnjoy, dislike: defaultDislike },
                artist: { enjoy: defaultEnjoy, dislike: defaultDislike },
                similarArtist: { enjoy: defaultEnjoy, dislike: defaultDislike },
            };
        }

        let sessionData: SatisfactionSessionData = {
            id: this.id,
            adjustments: adjustments,
            albumSongs: this.getAlbumSongs(listeningSession),
            artistSongs: this.getArtistSongs(listeningSession)
        };

        listeningSession.listeningFeatureSessions[this.id] = sessionData;
    }

    /**
     * Dislike functionality for the Listening Feature
     * @param listeningSession Listening Session to act on
     * @param collectiveDataStore Collective Data Store to store/retrieve
     */
    dislike(listeningSession: ListeningSession, collectiveDataStore: BaseCollectiveDataStore): void {
        super.dislike(listeningSession, collectiveDataStore);

        let satisfactionSessionData: ListeningFeatureSession = listeningSession.listeningFeatureSessions[this.id];
        if (!SatisfactionSessionData.IsSatisfactionSessionData(satisfactionSessionData)) {
            console.error("Listening session does not have Satisfaction Session Data to adjust probabilities");
            return;
        }

        let currentSong = listeningSession.currentSong;
        if (listeningSession.currentSong === null) {
            console.error("Listening session does not yet have a current song to dislike")
            return;
        }
        
        // Probability adjustments
        let adjustments = satisfactionSessionData.adjustments;

        // - Song
        this.adjust(
            [currentSong.id], 
            listeningSession, 
            adjustments.song.dislike);

        // - Album
        this.adjust(
            this.getSameAlbumSongs(currentSong, satisfactionSessionData),
            listeningSession,
            adjustments.album.dislike);

        // - Artist
        this.adjust(
            this.getSameArtistSongs(currentSong, satisfactionSessionData),
            listeningSession,
            adjustments.artist.dislike);

        // - Similar Artists
        this.adjust(
            this.getSimilarArtistSongs(currentSong, satisfactionSessionData, collectiveDataStore),
            listeningSession,
            adjustments.similarArtist.dislike);
    }
    
    /**
     * Enjoy functionality for the Listening Feature
     * @param listeningSession Listening Session to act on
     * @param collectiveDataStore Collective Data Store to store/retrieve
     */
    enjoy(listeningSession: ListeningSession, collectiveDataStore: BaseCollectiveDataStore): void {
        super.enjoy(listeningSession, collectiveDataStore);

        let satisfactionSessionData: ListeningFeatureSession = listeningSession.listeningFeatureSessions[this.id];
        if (!SatisfactionSessionData.IsSatisfactionSessionData(satisfactionSessionData)) {
            console.error("Listening session does not have Satisfaction Session Data to adjust probabilities");
            return;
        }

        let currentSong = listeningSession.currentSong;
        if (listeningSession.currentSong === null) {
            console.error("Listening session does not yet have a current song to enjoy")
            return;
        }

        // Probability adjustments
        let adjustments = satisfactionSessionData.adjustments;

        // - Song
        this.adjust(
            [currentSong.id], 
            listeningSession, 
            adjustments.song.enjoy);

        // - Album
        this.adjust(
            this.getSameAlbumSongs(currentSong, satisfactionSessionData),
            listeningSession,
            adjustments.album.enjoy);

        // - Artist
        this.adjust(
            this.getSameArtistSongs(currentSong, satisfactionSessionData),
            listeningSession,
            adjustments.artist.enjoy);

        // - Similar Artists
        this.adjust(
            this.getSimilarArtistSongs(currentSong, satisfactionSessionData, collectiveDataStore),
            listeningSession,
            adjustments.similarArtist.enjoy);
    }

    /**
     * Get a mapping from album ids to song ids from the listening session
     * @param listeningSession ListeningSession
     * @returns Indexer from Id to string set
     */
    private getAlbumSongs(listeningSession: ListeningSession): IdToStringSet {
        let albumSongs = {};

        listeningSession.playlist.songs.forEach(function (song: Song) {
            let album: Album = song.album;

            if (albumSongs[album.id] === undefined || albumSongs[album.id] === null) {
                albumSongs[album.id] = {};
            }

            // Add song to set 
            albumSongs[album.id][song.id] = true;
        });

        return albumSongs;
    }

    /**
     * Get a mapping from artist ids to song ids from the listening session
     * @param listeningSession ListeningSession
     * @returns Indexer from Id to string set
     */
    private getArtistSongs(listeningSession: ListeningSession): IdToStringSet {
        let artistSongs = {};

        listeningSession.playlist.songs.forEach(function (song: Song) {
            song.artists.forEach(function (artist: Artist) {
                if (artistSongs[artist.id] === undefined || artistSongs[artist.id] === null) {
                    artistSongs[artist.id] = {};
                }

                // Add song to set 
                artistSongs[artist.id][song.id] = true;
            });
        });

        return artistSongs;
    }

    /**
     * Get songs from the same album as the current song
     * @param currentSong The current song
     * @param sessionData The Satsifaction Session Data
     * @returns Array of Song Ids
     */
    private getSameAlbumSongs(currentSong: Song, sessionData: SatisfactionSessionData): Id[] {
        let result: Id[] = [];

        let albumSongs = sessionData.albumSongs[currentSong.album.id];
        if (albumSongs !== undefined && albumSongs !== null) {
            Object.keys(albumSongs).forEach(songId => result.push(songId));
        }

        return result;
    }

    /**
     * Get songs from the same artist as the current song
     * @param currentSong The current song
     * @param sessionData The Satsifaction Session Data
     * @returns Array of Song Ids
     */
    private getSameArtistSongs(currentSong: Song, sessionData: SatisfactionSessionData): Id[] {
        let result: StringSet = {};

        currentSong.artists.forEach(function (artist: Artist) {
            let currentArtistSongs = sessionData.artistSongs[artist.id];

            if (currentArtistSongs !== undefined && currentArtistSongs !== null) {
                Object.keys(currentArtistSongs).forEach(songId => result[songId] = true);
            }
        });

        return Object.keys(result);
    }

    /**
     * Get songs from similar artists to the current song
     * @param currentSong The current song
     * @param sessionData The Satsifaction Session Data
     * @param collectiveDataStore The Collective Data Store
     * @returns Array of Song Ids
     */
    private getSimilarArtistSongs(
        currentSong: Song, 
        sessionData: SatisfactionSessionData, 
        collectiveDataStore: BaseCollectiveDataStore): Id[] {

        let result: StringSet = {};

        // Collect similar artists
        let similarArtists: StringSet = {};
        currentSong.artists.forEach(function (artist: Artist) {
            let similarToCurrentArtist: CollectiveDataValue | null = collectiveDataStore.get(CollectiveDataStore.SimilarArtistsId, artist.id);

            if (StringSetCollectiveDataValue.IsStringSetCollectiveDataValue(similarToCurrentArtist)) {
                Object.keys(similarToCurrentArtist.value).forEach(artistId => similarArtists[artistId] = true);
            }
        });

        // Collect songs
        Object.keys(similarArtists).forEach(function (artistId: string) {
            let artistSongs = sessionData.artistSongs[artistId];
            if (artistSongs !== undefined && artistSongs !== null) {
                Object.keys(artistSongs).forEach(songId => result[songId] = true);
            }
        });

        return Object.keys(result);
    }

    /**
     * Helper method to adjust the probabiltiies of songs in the listening session
     * @param songIds Ids of the songs to adjust
     * @param listeningSession User's listening session
     * @param adjustment Probability adjustment function from (Song, number) => number
     */
    private adjust(songIds: Id[], listeningSession: ListeningSession, adjustment: (Song, number) => number): void {
        if (songIds === undefined || songIds === null) {
            return;
        }

        // Apply adjustment factor for all songs
        songIds.forEach(function (songId: Id) {
            let song: Song = listeningSession.playlist.songs[listeningSession.songIndex[songId]];
            listeningSession.probabilities[songId].value = 
                adjustment(song, listeningSession.probabilities[songId].value)
        });
    }
}
