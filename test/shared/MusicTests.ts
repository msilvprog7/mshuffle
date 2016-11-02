import {Album, Artist, Playlist, Song} from "../../shared/music";

import {MockAlbum, MockArtist, MockPlaylist, MockSong} from "../mock/music";

import chai = require("chai");


let expect = chai.expect;

/**
 * Album Unit Tests
 */
describe("Album", function () {
    // Test data
    let album1 = MockAlbum.makeWithNumericId(0),
        album2 = MockAlbum.make("Album2", "Album2", "album-2.png"),
        album3 = MockAlbum.make("Album3", "Album #3", "album-3.jpg");

    /**
     * AreAlbums() Test Cases
     */
    describe("AreAlbums()", function () {
        it("should return true for albums", function () {
            let value1 = [],
                value2 = [album1],
                value3 = [album1, album2, album3];
            
            let result1 = Album.AreAlbums(value1);
            let result2 = Album.AreAlbums(value2);
            let result3 = Album.AreAlbums(value3);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
        });

        it("should return false for non-albums", function () {
            let value1 = true,
                value2 = 2.654,
                value3 = "string",
                value4 = album3,
                value5 = [album1, album2, "string"];
            
            let result1 = Album.AreAlbums(value1);
            let result2 = Album.AreAlbums(value2);
            let result3 = Album.AreAlbums(value3);
            let result4 = Album.AreAlbums(value4);
            let result5 = Album.AreAlbums(value5);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
            expect(result4).to.equal(false);
            expect(result5).to.equal(false);
        });
    });

    /**
     * GetAlbums() Test Cases
     */
    describe("GetAlbums()", function () {
        it("should return albums for albums", function () {
            let value1 = [],
                value2 = [album1],
                value3 = [album1, album2, album3];
            
            let result1 = Album.GetAlbums(value1);
            let result2 = Album.GetAlbums(value2);
            let result3 = Album.GetAlbums(value3);

            expect(result1).to.deep.equal(value1);
            expect(result2).to.deep.equal(value2);
            expect(result3).to.deep.equal(value3);
        });

        it("should return an empty or partial list for non-albums", function () {
            let value1 = true,
                value2 = 2.654,
                value3 = "string",
                value4 = album3,
                value5 = [album1, album2, "string"],
                expectedResult5 = [album1, album2];
            
            let result1 = Album.GetAlbums(value1);
            let result2 = Album.GetAlbums(value2);
            let result3 = Album.GetAlbums(value3);
            let result4 = Album.GetAlbums(value4);
            let result5 = Album.GetAlbums(value5);

            expect(result1).to.deep.equal([]);
            expect(result2).to.deep.equal([]);
            expect(result3).to.deep.equal([]);
            expect(result4).to.deep.equal([]);
            expect(result5).to.deep.equal(expectedResult5);
        });
    });

    /**
     * IsAlbum() Test Cases
     */
    describe("IsAlbum()", function () {
        it("should return true for albums", function () {
            let result1 = Album.IsAlbum(album1);
            let result2 = Album.IsAlbum(album2);
            let result3 = Album.IsAlbum(album3);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
        });

        it("should return false for non-albums", function () {
            let value1 = true,
                value2 = 2.654,
                value3 = "string",
                value4 = { id: "1", name: 1, image: "1" },
                value5 = [album1, album2];
            
            let result1 = Album.IsAlbum(value1);
            let result2 = Album.IsAlbum(value2);
            let result3 = Album.IsAlbum(value3);
            let result4 = Album.IsAlbum(value4);
            let result5 = Album.IsAlbum(value5);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
            expect(result4).to.equal(false);
            expect(result5).to.equal(false);
        });
    });
});

/**
 * Artist Unit Tests
 */
describe("Artist", function () {
    // Test data
    let artist1 = MockArtist.makeWithNumericId(0),
        artist2 = MockArtist.make("Artist2", "Artist2"),
        artist3 = MockArtist.make("Artist3", "Artist #3");

    /**
     * AreArtists() Test Cases
     */
    describe("AreArtists()", function () {
        it("should return true for artists", function () {
            let value1 = [],
                value2 = [artist1],
                value3 = [artist1, artist2, artist3];
            
            let result1 = Artist.AreArtists(value1);
            let result2 = Artist.AreArtists(value2);
            let result3 = Artist.AreArtists(value3);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
        });

        it("should return false for non-artists", function () {
            let value1 = true,
                value2 = 2.654,
                value3 = "string",
                value4 = artist3,
                value5 = [artist1, artist2, "string"];
            
            let result1 = Artist.AreArtists(value1);
            let result2 = Artist.AreArtists(value2);
            let result3 = Artist.AreArtists(value3);
            let result4 = Artist.AreArtists(value4);
            let result5 = Artist.AreArtists(value5);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
            expect(result4).to.equal(false);
            expect(result5).to.equal(false);
        });
    });

    /**
     * GetArtists() Test Cases
     */
    describe("GetArtists()", function () {
        it("should return artists for artists", function () {
            let value1 = [],
                value2 = [artist1],
                value3 = [artist1, artist2, artist3];
            
            let result1 = Artist.GetArtists(value1);
            let result2 = Artist.GetArtists(value2);
            let result3 = Artist.GetArtists(value3);

            expect(result1).to.deep.equal(value1);
            expect(result2).to.deep.equal(value2);
            expect(result3).to.deep.equal(value3);
        });

        it("should return an empty or partial list for non-artists", function () {
            let value1 = true,
                value2 = 2.654,
                value3 = "string",
                value4 = artist3,
                value5 = [artist1, artist2, "string"],
                expectedResult5 = [artist1, artist2];
            
            let result1 = Artist.GetArtists(value1);
            let result2 = Artist.GetArtists(value2);
            let result3 = Artist.GetArtists(value3);
            let result4 = Artist.GetArtists(value4);
            let result5 = Artist.GetArtists(value5);

            expect(result1).to.deep.equal([]);
            expect(result2).to.deep.equal([]);
            expect(result3).to.deep.equal([]);
            expect(result4).to.deep.equal([]);
            expect(result5).to.deep.equal(expectedResult5);
        });
    });

    /**
     * IsArtist() Test Cases
     */
    describe("IsArtist()", function () {
        it("should return true for artists", function () {
            let result1 = Artist.IsArtist(artist1);
            let result2 = Artist.IsArtist(artist2);
            let result3 = Artist.IsArtist(artist3);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
        });

        it("should return false for non-artists", function () {
            let value1 = true,
                value2 = 2.654,
                value3 = "string",
                value4 = { id: "1", name: 1 },
                value5 = [artist1, artist2];
            
            let result1 = Artist.IsArtist(value1);
            let result2 = Artist.IsArtist(value2);
            let result3 = Artist.IsArtist(value3);
            let result4 = Artist.IsArtist(value4);
            let result5 = Artist.IsArtist(value5);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
            expect(result4).to.equal(false);
            expect(result5).to.equal(false);
        });
    });
});

/**
 * Playlist Unit Tests
 */
describe("Playlist", function () {
    // Test data
    let playlist1 = MockPlaylist.makeBasedOnNumSongs(0),
        playlist2 = MockPlaylist.makeBasedOnNumSongs(3),
        playlist3 = MockPlaylist.make(
            "Playlist3",
            "This is playlist No. 3.",
            "playlist-3.gif",
            "Playlist No. 3",
            "Michael",
            null);

    /**
     * ArePlaylists() Test Cases
     */
    describe("ArePlaylists()", function () {
        it("should return true for playlists", function () {
            let value1 = [],
                value2 = [playlist1],
                value3 = [playlist1, playlist2, playlist3];
            
            let result1 = Playlist.ArePlaylists(value1);
            let result2 = Playlist.ArePlaylists(value2);
            let result3 = Playlist.ArePlaylists(value3);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
        });

        it("should return false for non-playlists", function () {
            let value1 = true,
                value2 = 2.654,
                value3 = "string",
                value4 = playlist3,
                value5 = [playlist1, playlist2, "string"];
            
            let result1 = Playlist.ArePlaylists(value1);
            let result2 = Playlist.ArePlaylists(value2);
            let result3 = Playlist.ArePlaylists(value3);
            let result4 = Playlist.ArePlaylists(value4);
            let result5 = Playlist.ArePlaylists(value5);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
            expect(result4).to.equal(false);
            expect(result5).to.equal(false);
        });
    });

    /**
     * GetPlaylists() Test Cases
     */
    describe("GetPlaylists()", function () {
        it("should return playlists for playlists", function () {
            let value1 = [],
                value2 = [playlist1],
                value3 = [playlist1, playlist2, playlist3];
            
            let result1 = Playlist.GetPlaylists(value1);
            let result2 = Playlist.GetPlaylists(value2);
            let result3 = Playlist.GetPlaylists(value3);

            expect(result1).to.deep.equal(value1);
            expect(result2).to.deep.equal(value2);
            expect(result3).to.deep.equal(value3);
        });

        it("should return an empty or partial list for non-playlists", function () {
            let value1 = true,
                value2 = 2.654,
                value3 = "string",
                value4 = playlist3,
                value5 = [playlist1, playlist2, "string"],
                expectedResult5 = [playlist1, playlist2];
            
            let result1 = Playlist.GetPlaylists(value1);
            let result2 = Playlist.GetPlaylists(value2);
            let result3 = Playlist.GetPlaylists(value3);
            let result4 = Playlist.GetPlaylists(value4);
            let result5 = Playlist.GetPlaylists(value5);

            expect(result1).to.deep.equal([]);
            expect(result2).to.deep.equal([]);
            expect(result3).to.deep.equal([]);
            expect(result4).to.deep.equal([]);
            expect(result5).to.deep.equal(expectedResult5);
        });
    });

    /**
     * IsPlaylist() Test Cases
     */
    describe("IsPlaylist()", function () {
        it("should return true for playlists", function () {
            let result1 = Playlist.IsPlaylist(playlist1);
            let result2 = Playlist.IsPlaylist(playlist2);
            let result3 = Playlist.IsPlaylist(playlist3);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
        });

        it("should return false for non-playlists", function () {
            let value1 = true,
                value2 = 2.654,
                value3 = "string",
                value4 = { id: "1", name: 1 },
                value5 = [playlist1, playlist2];
            
            let result1 = Playlist.IsPlaylist(value1);
            let result2 = Playlist.IsPlaylist(value2);
            let result3 = Playlist.IsPlaylist(value3);
            let result4 = Playlist.IsPlaylist(value4);
            let result5 = Playlist.IsPlaylist(value5);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
            expect(result4).to.equal(false);
            expect(result5).to.equal(false);
        });
    });
});

/**
 * Song Unit Tests
 */
describe("Song", function () {
    // Test data
    let song1 = MockSong.makeSingleAlbumSingleArtist(0),
        song2 = MockSong.make(
            "Song2",
            MockAlbum.makeWithNumericId(1),
            [MockArtist.makeWithNumericId(1)],
            123,
            "Song #2.",
            "song-1aynhliaer8n"),
        song3 = MockSong.make(
            "Song3",
            MockAlbum.makeWithNumericId(2),
            [MockArtist.makeWithNumericId(1), MockArtist.makeWithNumericId(2)],
            59,
            "Song #3!",
            "song-dfadsf797f",
            "https://song.no3.gov/listen.php?enable-webcam=true&jk=true");
    
    /**
     * AreSongs() Test Cases
     */
    describe("AreSongs()", function () {
        it("should return true for songs", function () {
            let value1 = [],
                value2 = [song1],
                value3 = [song1, song2, song3];
            
            let result1 = Song.AreSongs(value1);
            let result2 = Song.AreSongs(value2);
            let result3 = Song.AreSongs(value3);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
        });

        it("should return false for non-songs", function () {
            let value1 = true,
                value2 = 2.654,
                value3 = "string",
                value4 = song3,
                value5 = [song1, song2, "string"];
            
            let result1 = Song.AreSongs(value1);
            let result2 = Song.AreSongs(value2);
            let result3 = Song.AreSongs(value3);
            let result4 = Song.AreSongs(value4);
            let result5 = Song.AreSongs(value5);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
            expect(result4).to.equal(false);
            expect(result5).to.equal(false);
        });
    });

    /**
     * GetSongs() Test Cases
     */
    describe("GetSongs()", function () {
        it("should return songs for songs", function () {
            let value1 = [],
                value2 = [song1],
                value3 = [song1, song2, song3];
            
            let result1 = Song.GetSongs(value1);
            let result2 = Song.GetSongs(value2);
            let result3 = Song.GetSongs(value3);

            expect(result1).to.deep.equal(value1);
            expect(result2).to.deep.equal(value2);
            expect(result3).to.deep.equal(value3);
        });

        it("should return an empty or partial list for non-playlists", function () {
            let value1 = true,
                value2 = 2.654,
                value3 = "string",
                value4 = song3,
                value5 = [song1, song2, "string"],
                expectedResult5 = [song1, song2];
            
            let result1 = Song.GetSongs(value1);
            let result2 = Song.GetSongs(value2);
            let result3 = Song.GetSongs(value3);
            let result4 = Song.GetSongs(value4);
            let result5 = Song.GetSongs(value5);

            expect(result1).to.deep.equal([]);
            expect(result2).to.deep.equal([]);
            expect(result3).to.deep.equal([]);
            expect(result4).to.deep.equal([]);
            expect(result5).to.deep.equal(expectedResult5);
        });
    });

    /**
     * IsSong() Test Cases
     */
    describe("IsSong()", function () {
        it("should return true for songs", function () {
            let result1 = Song.IsSong(song1);
            let result2 = Song.IsSong(song2);
            let result3 = Song.IsSong(song3);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
        });

        it("should return false for non-songs", function () {
            let value1 = true,
                value2 = 2.654,
                value3 = "string",
                value4 = { id: "1", name: 1 },
                value5 = [song1, song2];
            
            let result1 = Song.IsSong(value1);
            let result2 = Song.IsSong(value2);
            let result3 = Song.IsSong(value3);
            let result4 = Song.IsSong(value4);
            let result5 = Song.IsSong(value5);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
            expect(result4).to.equal(false);
            expect(result5).to.equal(false);
        });
    });
});
