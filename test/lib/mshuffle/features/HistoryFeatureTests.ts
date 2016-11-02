import HistoryFeature from "../../../../lib/mshuffle/features/HistoryFeature";
import {Capacity, HistoryQueue} from "../../../../shared/features/history";

import {ListeningFeatureSession, ListeningSession} from "../../../../shared/mshuffle";

import {Album, Artist, Playlist, Song} from "../../../../shared/music";

import {BaseCollectiveDataStore} from "../../../../shared/data";
import CollectiveDataStore from "../../../../lib/data/CollectiveDataStore"

import {MockListeningSession} from "../../../mock/mshuffle";
import {MockPlaylist} from "../../../mock/music";
import {MockCapacity} from "../../../mock/features/history";

import chai = require("chai");


let expect = chai.expect;

/**
 * HistoryFeature Unit Tests
 */
describe("HistoryFeature", function () {
    // Test data
    let historyFeature: HistoryFeature,
        collectiveDataStore: BaseCollectiveDataStore = new CollectiveDataStore(),
        numSongs = 100,
        listeningSession: ListeningSession,
        historyQueueSize = 0.15;

    /**
     * Set up before each test
     */
    beforeEach(function () {
        historyFeature = new HistoryFeature();
        listeningSession = MockListeningSession.makeWithPlaylist(
            "MyTestListeningSession", 
            MockPlaylist.makeBasedOnNumSongs(numSongs));
    });

    /**
     * load() Test Cases
     */
    describe("load()", function () {
        it("should default to the default History Queue Size, 15% of the songs", function () {
            let expectedCapacity = Math.round(numSongs * historyQueueSize);

            historyFeature.load(listeningSession, collectiveDataStore);

            expect(listeningSession.listeningFeatureSessions).to.have.property(HistoryFeature.HistoryFeatureId);
            let listeningFeature: ListeningFeatureSession = listeningSession.listeningFeatureSessions[HistoryFeature.HistoryFeatureId];
            expect(HistoryQueue.IsHistoryQueue(listeningFeature)).to.equal(true);
            let historyQueue: HistoryQueue = <HistoryQueue>listeningFeature;
            expect(historyQueue.capacity).to.equal(expectedCapacity);
        });

        it("should accept a Capacity as a proportion of the songs", function () {
            let capacity: Capacity = MockCapacity.make(0.25),
                expectedCapacity = Math.round(numSongs * capacity.capacity);

            historyFeature.load(listeningSession, collectiveDataStore, capacity);

            expect(listeningSession.listeningFeatureSessions).to.have.property(HistoryFeature.HistoryFeatureId);
            let listeningFeature: ListeningFeatureSession = listeningSession.listeningFeatureSessions[HistoryFeature.HistoryFeatureId];
            expect(HistoryQueue.IsHistoryQueue(listeningFeature)).to.equal(true);
            let historyQueue: HistoryQueue = <HistoryQueue>listeningFeature;
            expect(historyQueue.capacity).to.equal(expectedCapacity);
        });

        it("should accept a fixed size Capacity of songs", function () {
            let capacity: Capacity = MockCapacity.make(27),
                expectedCapacity = capacity.capacity;

            historyFeature.load(listeningSession, collectiveDataStore, capacity);

            expect(listeningSession.listeningFeatureSessions).to.have.property(HistoryFeature.HistoryFeatureId);
            let listeningFeature: ListeningFeatureSession = listeningSession.listeningFeatureSessions[HistoryFeature.HistoryFeatureId];
            expect(HistoryQueue.IsHistoryQueue(listeningFeature)).to.equal(true);
            let historyQueue: HistoryQueue = <HistoryQueue>listeningFeature;
            expect(historyQueue.capacity).to.equal(expectedCapacity);
        });

        it("should accept a fixed size Capacity of songs, but cap it so at least one song can play", function () {
            let capacity: Capacity = MockCapacity.make(numSongs),
                expectedCapacity = (numSongs - 1);

            historyFeature.load(listeningSession, collectiveDataStore, capacity);

            expect(listeningSession.listeningFeatureSessions).to.have.property(HistoryFeature.HistoryFeatureId);
            let listeningFeature: ListeningFeatureSession = listeningSession.listeningFeatureSessions[HistoryFeature.HistoryFeatureId];
            expect(HistoryQueue.IsHistoryQueue(listeningFeature)).to.equal(true);
            let historyQueue: HistoryQueue = <HistoryQueue>listeningFeature;
            expect(historyQueue.capacity).to.equal(expectedCapacity);
        });

        it("should use the default if a non-Capacity is passed in", function () {
            let notCapacity: any = {
                    capacity: "not-a-real-capacity",
                    notACapacity: 27
                },
                expectedCapacity = Math.round(numSongs * historyQueueSize);

            historyFeature.load(listeningSession, collectiveDataStore, notCapacity);

            expect(listeningSession.listeningFeatureSessions).to.have.property(HistoryFeature.HistoryFeatureId);
            let listeningFeature: ListeningFeatureSession = listeningSession.listeningFeatureSessions[HistoryFeature.HistoryFeatureId];
            expect(HistoryQueue.IsHistoryQueue(listeningFeature)).to.equal(true);
            let historyQueue: HistoryQueue = <HistoryQueue>listeningFeature;
            expect(historyQueue.capacity).to.equal(expectedCapacity);
        });
    });

    /**
     * next() Test Cases (same as push)
     */
    describe("next()", function () {
        it("should be able to add a song to the queue", function () {
            let capacity: Capacity = MockCapacity.make(3),
                expectedInQueue = 1,
                song = listeningSession.playlist.songs[0];

            historyFeature.load(listeningSession, collectiveDataStore, capacity);
            
            listeningSession.currentSong = song;
            historyFeature.push(listeningSession);

            expect(listeningSession.listeningFeatureSessions).to.have.property(HistoryFeature.HistoryFeatureId);
            let listeningFeature: ListeningFeatureSession = listeningSession.listeningFeatureSessions[HistoryFeature.HistoryFeatureId];
            expect(HistoryQueue.IsHistoryQueue(listeningFeature)).to.equal(true);
            let historyQueue: HistoryQueue = <HistoryQueue>listeningFeature;
            expect(historyQueue.queue.length).to.equal(expectedInQueue);
            expect(historyQueue.queue[0]).to.equal(song.id);
            expect(Object.keys(historyQueue.set).length).to.equal(expectedInQueue);
            expect(historyQueue.set[song.id]).to.equal(true);
            expect(listeningSession.probabilities[song.id].value).to.equal(0);
        });

        it("should be able to add a few songs to the queue", function () {
            let capacity: Capacity = MockCapacity.make(3),
                expectedInQueue = 3,
                song = listeningSession.playlist.songs[0],
                song2 = listeningSession.playlist.songs[1],
                song3 = listeningSession.playlist.songs[2];

            historyFeature.load(listeningSession, collectiveDataStore, capacity);
            
            listeningSession.currentSong = song;
            historyFeature.push(listeningSession);
            listeningSession.currentSong = song2;
            historyFeature.push(listeningSession);
            listeningSession.currentSong = song3;
            historyFeature.push(listeningSession);

            expect(listeningSession.listeningFeatureSessions).to.have.property(HistoryFeature.HistoryFeatureId);
            let listeningFeature: ListeningFeatureSession = listeningSession.listeningFeatureSessions[HistoryFeature.HistoryFeatureId];
            expect(HistoryQueue.IsHistoryQueue(listeningFeature)).to.equal(true);
            let historyQueue: HistoryQueue = <HistoryQueue>listeningFeature;
            expect(historyQueue.queue.length).to.equal(expectedInQueue);
            expect(historyQueue.queue[0]).to.equal(song.id);
            expect(historyQueue.queue[1]).to.equal(song2.id);
            expect(historyQueue.queue[2]).to.equal(song3.id);
            expect(Object.keys(historyQueue.set).length).to.equal(expectedInQueue);
            expect(historyQueue.set[song.id]).to.equal(true);
            expect(historyQueue.set[song2.id]).to.equal(true);
            expect(historyQueue.set[song3.id]).to.equal(true);
            expect(listeningSession.probabilities[song.id].value).to.equal(0);
            expect(listeningSession.probabilities[song2.id].value).to.equal(0);
            expect(listeningSession.probabilities[song3.id].value).to.equal(0);
        });

        it("should be able to pop a song when the queue is full", function () {
            let capacity: Capacity = MockCapacity.make(3),
                expectedInQueue = 3,
                song = listeningSession.playlist.songs[0],
                songOriginalProb = listeningSession.probabilities[song.id].value,
                song2 = listeningSession.playlist.songs[1],
                song3 = listeningSession.playlist.songs[2],
                song4 = listeningSession.playlist.songs[3];

            historyFeature.load(listeningSession, collectiveDataStore, capacity);
            
            listeningSession.currentSong = song;
            historyFeature.push(listeningSession);
            listeningSession.currentSong = song2;
            historyFeature.push(listeningSession);
            listeningSession.currentSong = song3;
            historyFeature.push(listeningSession);
            listeningSession.currentSong = song4;
            historyFeature.push(listeningSession);

            expect(listeningSession.listeningFeatureSessions).to.have.property(HistoryFeature.HistoryFeatureId);
            let listeningFeature: ListeningFeatureSession = listeningSession.listeningFeatureSessions[HistoryFeature.HistoryFeatureId];
            expect(HistoryQueue.IsHistoryQueue(listeningFeature)).to.equal(true);
            let historyQueue: HistoryQueue = <HistoryQueue>listeningFeature;
            expect(historyQueue.queue.length).to.equal(expectedInQueue);
            expect(historyQueue.queue[0]).to.equal(song2.id);
            expect(historyQueue.queue[1]).to.equal(song3.id);
            expect(historyQueue.queue[2]).to.equal(song4.id);
            expect(Object.keys(historyQueue.set).length).to.equal(expectedInQueue);
            expect(historyQueue.set).to.not.have.property(song.id);
            expect(historyQueue.set[song2.id]).to.equal(true);
            expect(historyQueue.set[song3.id]).to.equal(true);
            expect(historyQueue.set[song4.id]).to.equal(true);
            expect(listeningSession.probabilities[song.id].value).to.equal(songOriginalProb);
            expect(listeningSession.probabilities[song2.id].value).to.equal(0);
            expect(listeningSession.probabilities[song3.id].value).to.equal(0);
            expect(listeningSession.probabilities[song4.id].value).to.equal(0);
        });

        it("should not add a song to queue when there is not a current song playing", function () {
            let capacity: Capacity = MockCapacity.make(3),
                expectedInQueue = 0;

            historyFeature.load(listeningSession, collectiveDataStore, capacity);
            
            listeningSession.currentSong = null;
            historyFeature.push(listeningSession);

            expect(listeningSession.listeningFeatureSessions).to.have.property(HistoryFeature.HistoryFeatureId);
            let listeningFeature: ListeningFeatureSession = listeningSession.listeningFeatureSessions[HistoryFeature.HistoryFeatureId];
            expect(HistoryQueue.IsHistoryQueue(listeningFeature)).to.equal(true);
            let historyQueue: HistoryQueue = <HistoryQueue>listeningFeature;
            expect(historyQueue.queue.length).to.equal(expectedInQueue);
            expect(Object.keys(historyQueue.set).length).to.equal(expectedInQueue);
        });

        it("should not be able to push the same song again", function () {
            let capacity: Capacity = MockCapacity.make(3),
                expectedInQueue = 1,
                song = listeningSession.playlist.songs[0];

            historyFeature.load(listeningSession, collectiveDataStore, capacity);
            
            listeningSession.currentSong = song;
            historyFeature.push(listeningSession);
            historyFeature.push(listeningSession);

            expect(listeningSession.listeningFeatureSessions).to.have.property(HistoryFeature.HistoryFeatureId);
            let listeningFeature: ListeningFeatureSession = listeningSession.listeningFeatureSessions[HistoryFeature.HistoryFeatureId];
            expect(HistoryQueue.IsHistoryQueue(listeningFeature)).to.equal(true);
            let historyQueue: HistoryQueue = <HistoryQueue>listeningFeature;
            expect(historyQueue.queue.length).to.equal(expectedInQueue);
            expect(historyQueue.queue[0]).to.equal(song.id);
            expect(Object.keys(historyQueue.set).length).to.equal(expectedInQueue);
            expect(historyQueue.set[song.id]).to.equal(true);
            expect(listeningSession.probabilities[song.id].value).to.equal(0);
        });
    });

    /**
     * pop() Test Cases
     */
    describe("pop()", function () {
        it("should be able to pop a song", function () {
            let capacity: Capacity = MockCapacity.make(3),
                expectedInQueue = 0,
                song = listeningSession.playlist.songs[0],
                originalSongProb = listeningSession.probabilities[song.id].value;

            historyFeature.load(listeningSession, collectiveDataStore, capacity);
            
            listeningSession.currentSong = song;
            historyFeature.push(listeningSession);
            historyFeature.pop(listeningSession);

            expect(listeningSession.listeningFeatureSessions).to.have.property(HistoryFeature.HistoryFeatureId);
            let listeningFeature: ListeningFeatureSession = listeningSession.listeningFeatureSessions[HistoryFeature.HistoryFeatureId];
            expect(HistoryQueue.IsHistoryQueue(listeningFeature)).to.equal(true);
            let historyQueue: HistoryQueue = <HistoryQueue>listeningFeature;
            expect(historyQueue.queue.length).to.equal(expectedInQueue);
            expect(Object.keys(historyQueue.set).length).to.equal(expectedInQueue);
            expect(listeningSession.probabilities[song.id].value).to.equal(originalSongProb);
        });

        it("should not pop on empty queue", function () {
            let capacity: Capacity = MockCapacity.make(3),
                expectedInQueue = 0;

            historyFeature.load(listeningSession, collectiveDataStore, capacity);
            
            listeningSession.currentSong = null;
            historyFeature.pop(listeningSession);

            expect(listeningSession.listeningFeatureSessions).to.have.property(HistoryFeature.HistoryFeatureId);
            let listeningFeature: ListeningFeatureSession = listeningSession.listeningFeatureSessions[HistoryFeature.HistoryFeatureId];
            expect(HistoryQueue.IsHistoryQueue(listeningFeature)).to.equal(true);
            let historyQueue: HistoryQueue = <HistoryQueue>listeningFeature;
            expect(historyQueue.queue.length).to.equal(expectedInQueue);
            expect(Object.keys(historyQueue.set).length).to.equal(expectedInQueue);
        });
    });

    /**
     * push() Test Cases
     */
    describe("push()", function () {
        it("should be able to add a song to the queue", function () {
            let capacity: Capacity = MockCapacity.make(3),
                expectedInQueue = 1,
                song = listeningSession.playlist.songs[0];

            historyFeature.load(listeningSession, collectiveDataStore, capacity);
            
            listeningSession.currentSong = song;
            historyFeature.push(listeningSession);

            expect(listeningSession.listeningFeatureSessions).to.have.property(HistoryFeature.HistoryFeatureId);
            let listeningFeature: ListeningFeatureSession = listeningSession.listeningFeatureSessions[HistoryFeature.HistoryFeatureId];
            expect(HistoryQueue.IsHistoryQueue(listeningFeature)).to.equal(true);
            let historyQueue: HistoryQueue = <HistoryQueue>listeningFeature;
            expect(historyQueue.queue.length).to.equal(expectedInQueue);
            expect(historyQueue.queue[0]).to.equal(song.id);
            expect(Object.keys(historyQueue.set).length).to.equal(expectedInQueue);
            expect(historyQueue.set[song.id]).to.equal(true);
            expect(listeningSession.probabilities[song.id].value).to.equal(0);
        });

        it("should be able to add a few songs to the queue", function () {
            let capacity: Capacity = MockCapacity.make(3),
                expectedInQueue = 3,
                song = listeningSession.playlist.songs[0],
                song2 = listeningSession.playlist.songs[1],
                song3 = listeningSession.playlist.songs[2];

            historyFeature.load(listeningSession, collectiveDataStore, capacity);
            
            listeningSession.currentSong = song;
            historyFeature.push(listeningSession);
            listeningSession.currentSong = song2;
            historyFeature.push(listeningSession);
            listeningSession.currentSong = song3;
            historyFeature.push(listeningSession);

            expect(listeningSession.listeningFeatureSessions).to.have.property(HistoryFeature.HistoryFeatureId);
            let listeningFeature: ListeningFeatureSession = listeningSession.listeningFeatureSessions[HistoryFeature.HistoryFeatureId];
            expect(HistoryQueue.IsHistoryQueue(listeningFeature)).to.equal(true);
            let historyQueue: HistoryQueue = <HistoryQueue>listeningFeature;
            expect(historyQueue.queue.length).to.equal(expectedInQueue);
            expect(historyQueue.queue[0]).to.equal(song.id);
            expect(historyQueue.queue[1]).to.equal(song2.id);
            expect(historyQueue.queue[2]).to.equal(song3.id);
            expect(Object.keys(historyQueue.set).length).to.equal(expectedInQueue);
            expect(historyQueue.set[song.id]).to.equal(true);
            expect(historyQueue.set[song2.id]).to.equal(true);
            expect(historyQueue.set[song3.id]).to.equal(true);
            expect(listeningSession.probabilities[song.id].value).to.equal(0);
            expect(listeningSession.probabilities[song2.id].value).to.equal(0);
            expect(listeningSession.probabilities[song3.id].value).to.equal(0);
        });

        it("should be able to pop a song when the queue is full", function () {
            let capacity: Capacity = MockCapacity.make(3),
                expectedInQueue = 3,
                song = listeningSession.playlist.songs[0],
                songOriginalProb = listeningSession.probabilities[song.id].value,
                song2 = listeningSession.playlist.songs[1],
                song3 = listeningSession.playlist.songs[2],
                song4 = listeningSession.playlist.songs[3];

            historyFeature.load(listeningSession, collectiveDataStore, capacity);
            
            listeningSession.currentSong = song;
            historyFeature.push(listeningSession);
            listeningSession.currentSong = song2;
            historyFeature.push(listeningSession);
            listeningSession.currentSong = song3;
            historyFeature.push(listeningSession);
            listeningSession.currentSong = song4;
            historyFeature.push(listeningSession);

            expect(listeningSession.listeningFeatureSessions).to.have.property(HistoryFeature.HistoryFeatureId);
            let listeningFeature: ListeningFeatureSession = listeningSession.listeningFeatureSessions[HistoryFeature.HistoryFeatureId];
            expect(HistoryQueue.IsHistoryQueue(listeningFeature)).to.equal(true);
            let historyQueue: HistoryQueue = <HistoryQueue>listeningFeature;
            expect(historyQueue.queue.length).to.equal(expectedInQueue);
            expect(historyQueue.queue[0]).to.equal(song2.id);
            expect(historyQueue.queue[1]).to.equal(song3.id);
            expect(historyQueue.queue[2]).to.equal(song4.id);
            expect(Object.keys(historyQueue.set).length).to.equal(expectedInQueue);
            expect(historyQueue.set).to.not.have.property(song.id);
            expect(historyQueue.set[song2.id]).to.equal(true);
            expect(historyQueue.set[song3.id]).to.equal(true);
            expect(historyQueue.set[song4.id]).to.equal(true);
            expect(listeningSession.probabilities[song.id].value).to.equal(songOriginalProb);
            expect(listeningSession.probabilities[song2.id].value).to.equal(0);
            expect(listeningSession.probabilities[song3.id].value).to.equal(0);
            expect(listeningSession.probabilities[song4.id].value).to.equal(0);
        });

        it("should not add a song to queue when there is not a current song playing", function () {
            let capacity: Capacity = MockCapacity.make(3),
                expectedInQueue = 0;

            historyFeature.load(listeningSession, collectiveDataStore, capacity);
            
            listeningSession.currentSong = null;
            historyFeature.push(listeningSession);

            expect(listeningSession.listeningFeatureSessions).to.have.property(HistoryFeature.HistoryFeatureId);
            let listeningFeature: ListeningFeatureSession = listeningSession.listeningFeatureSessions[HistoryFeature.HistoryFeatureId];
            expect(HistoryQueue.IsHistoryQueue(listeningFeature)).to.equal(true);
            let historyQueue: HistoryQueue = <HistoryQueue>listeningFeature;
            expect(historyQueue.queue.length).to.equal(expectedInQueue);
            expect(Object.keys(historyQueue.set).length).to.equal(expectedInQueue);
        });

        it("should not be able to push the same song again", function () {
            let capacity: Capacity = MockCapacity.make(3),
                expectedInQueue = 1,
                song = listeningSession.playlist.songs[0];

            historyFeature.load(listeningSession, collectiveDataStore, capacity);
            
            listeningSession.currentSong = song;
            historyFeature.push(listeningSession);
            historyFeature.push(listeningSession);

            expect(listeningSession.listeningFeatureSessions).to.have.property(HistoryFeature.HistoryFeatureId);
            let listeningFeature: ListeningFeatureSession = listeningSession.listeningFeatureSessions[HistoryFeature.HistoryFeatureId];
            expect(HistoryQueue.IsHistoryQueue(listeningFeature)).to.equal(true);
            let historyQueue: HistoryQueue = <HistoryQueue>listeningFeature;
            expect(historyQueue.queue.length).to.equal(expectedInQueue);
            expect(historyQueue.queue[0]).to.equal(song.id);
            expect(Object.keys(historyQueue.set).length).to.equal(expectedInQueue);
            expect(historyQueue.set[song.id]).to.equal(true);
            expect(listeningSession.probabilities[song.id].value).to.equal(0);
        });
    });
});
