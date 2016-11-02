/**
 * Mock data for mshuffle related interfaces
 */

import {ListeningFeatureSessions, ListeningSession} from "../../shared/mshuffle";

import {Playlist, Song} from "../../shared/music";

import {IdToNumber, Probabilities} from "../../shared/data";

import {Id} from "../../shared/auth";

import {MockIdMapping, MockProbability} from "./data";


/**
 * Listening Session mocks
 */
export class MockListeningSession {
    /**
     * Make a listening session mock
     */
    public static make(
        id: Id, 
        listeningFeatureSessions: ListeningFeatureSessions, 
        playlist: Playlist,
        probabilities: Probabilities,
        currentSong: Song | null,
        songIndex: IdToNumber): ListeningSession {

        return {
            id: id,
            listeningFeatureSessions: listeningFeatureSessions,
            playlist: playlist,
            probabilities: probabilities,
            currentSong: currentSong,
            songIndex: songIndex
        };
    }

    /**
     * Make a listening session based on playlist
     */
    public static makeWithPlaylist(id: Id, playlist: Playlist): ListeningSession {
        return MockListeningSession.make(
            id,
            {},
            playlist,
            MockProbability.makeWithSongs(playlist.songs),
            null,
            MockIdMapping.makeWithSongs(playlist.songs));
    }
}
