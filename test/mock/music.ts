/**
 * Mock data for music related interfaces
 */

import {Album, Artist, Playlist, Song} from "../../shared/music";

import {Id} from "../../shared/auth";

import {uri} from "../../shared/http";


/**
 * Album mocks
 */
export class MockAlbum {
    /**
     * Make an album mock
     */
    public static make(id: Id, name: string, image: uri): Album {
        return {
            id: id,
            name: name,
            image: image
        };
    }

    /**
     * Make an album mock based on a numeric identifier
     */
    public static makeWithNumericId(numericId: number): Album {
        return {
            id: `Album ${numericId}`,
            image: `song-${numericId}.png`,
            name: `Album ${numericId}`
        };
    }
}

/**
 * Artist mocks
 */
export class MockArtist {
    /**
     * Make an artist mock
     */
    public static make(id: Id, name: string): Artist {
        return {
            id: id,
            name: name
        };
    }

    /**
     * Make an artist mock based on a numeric identifier
     */
    public static makeWithNumericId(numericId: number): Artist {
        return {
            id: `Artist ${numericId}`,
            name: `Artist ${numericId}`
        };
    }
}

/**
 * Playlist mocks
 */
export class MockPlaylist {
    /**
     * Make a playlist mock
     */
    public static make(id: Id, description: string, image: uri | null, name: string, owner: string, songs: Song[] | null): Playlist {
        return {
            id: id,
            description: description,
            image: image,
            name: name,
            owner: owner,
            songs: songs
        };
    }

    /**
     * Make a playlist based on number of songs
     */
    public static makeBasedOnNumSongs(numSongs: number): Playlist {
        let playlist: Playlist = MockPlaylist.make(
            "MyTestPlaylist",
            "Playlist description",
            null,
            "MyTestPlaylist",
            "Michael",
            []);
        
        for (let i = 0; i < numSongs; i++) {
            playlist.songs.push(MockSong.makeSingleAlbumSingleArtist(i));
        }

        return playlist;
    }
}

/**
 * Song mocks
 */
export class MockSong {
    /**
     * Make a song mock
     */
    public static make(id: Id, album: Album, artists: Artist[], duration: number, name: string, uri: uri, url?: uri): Song {
        return {
            id: id,
            album: album,
            artists: artists,
            duration: duration,
            name: name,
            uri: uri,
            url: url
        };
    }

    /**
     * Mock a single album, single artist Song that uses
     * the numericId to create Ids
     */
    public static makeSingleAlbumSingleArtist(numericId: number): Song {
        return {
            id: `Song ${numericId}`,
            album: MockAlbum.makeWithNumericId(numericId),
            artists: [MockArtist.makeWithNumericId(numericId)],
            duration: numericId,
            name: `Song ${numericId}`,
            uri: `uri:${numericId}`,
            url: `/song/${numericId}`
        };
    }
}
