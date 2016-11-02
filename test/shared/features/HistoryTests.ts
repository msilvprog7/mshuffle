import {Capacity, HistoryQueue} from "../../../shared/features/history";

import {MockCapacity, MockHistoryQueue} from "../../mock/features/history";

import chai = require("chai");


let expect = chai.expect;

/**
 * HistoryQueue Unit Tests
 */
describe("HistoryQueue", function () {
    /**
     * IsHistoryQueue() Test Cases
     */
    describe("IsHistoryQueue()", function () {
        it("should return true for valid HistoryQueues", function () {
            let historyQueue1 = MockHistoryQueue.make("HistoryQueue1", [], {}, 0.15, {}),
                historyQueue2 = MockHistoryQueue.make("HistoryQueue2", [], {}, 0.15, {"SongId": 0.1}),
                historyQueue3 = MockHistoryQueue.make("HistoryQueue3", [], {"SongId": true}, 17, {}),
                historyQueue4 = MockHistoryQueue.make("HistoryQueue4", [], {"SongId": true}, 0.15, {"SongId": 0.1}),
                historyQueue5 = MockHistoryQueue.make("HistoryQueue5", ["SongId"], {}, 0.15, {}),
                historyQueue6 = MockHistoryQueue.make("HistoryQueue6", ["SongId"], {}, 0.15, {"SongId": 0.2}),
                historyQueue7 = MockHistoryQueue.make("HistoryQueue7", ["SongId"], {"SongId": true}, 0.15, {}),
                historyQueue8 = MockHistoryQueue.make("HistoryQueue8", ["SongId"], {"SongId": true}, 0.15, {"SongId": 0.4});
            
            let result1 = HistoryQueue.IsHistoryQueue(historyQueue1);
            let result2 = HistoryQueue.IsHistoryQueue(historyQueue2);
            let result3 = HistoryQueue.IsHistoryQueue(historyQueue3);
            let result4 = HistoryQueue.IsHistoryQueue(historyQueue4);
            let result5 = HistoryQueue.IsHistoryQueue(historyQueue5);
            let result6 = HistoryQueue.IsHistoryQueue(historyQueue6);
            let result7 = HistoryQueue.IsHistoryQueue(historyQueue7);
            let result8 = HistoryQueue.IsHistoryQueue(historyQueue8);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
            expect(result4).to.equal(true);
            expect(result5).to.equal(true);
            expect(result6).to.equal(true);
            expect(result7).to.equal(true);
            expect(result8).to.equal(true);
        });

        it("should return false for invalid HistoryQueues", function () {
            let bool = true,
                num = 27,
                capacity: Capacity = MockCapacity.make(29),
                queueObjNotList = { 
                    id: "id",
                    queue: { value: true },
                    set: {},
                    capacity: 0.15,
                    storedSongProbabilities: {}
                },
                idValue = { id: true };
            
            let result1 = HistoryQueue.IsHistoryQueue(bool);
            let result2 = HistoryQueue.IsHistoryQueue(num);
            let result3 = HistoryQueue.IsHistoryQueue(capacity);
            let result4 = HistoryQueue.IsHistoryQueue(queueObjNotList);
            let result5 = HistoryQueue.IsHistoryQueue(idValue);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
            expect(result4).to.equal(false);
            expect(result5).to.equal(false);
        });
    });
});

/**
 * Capacity Unit Tests
 */
describe("Capacity", function () {
    /**
     * IsCapacity() Test Cases
     */
    describe("IsCapacity()", function () {
        it("should return true for valid Capacities", function () {
            let capacity1: Capacity = MockCapacity.make(0.0),
                capacity2: Capacity = MockCapacity.make(0.15),
                capacity3: Capacity = MockCapacity.make(15);
            
            let result1 = Capacity.IsCapacity(capacity1);
            let result2 = Capacity.IsCapacity(capacity2);
            let result3 = Capacity.IsCapacity(capacity3);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
        });

        it("should return false for invalid Capacities", function () {
            let bool = true,
                num = 27,
                notCapacity = { 
                    id: "id",
                    queue: { value: true },
                    set: {},
                    notCapacity: 0.15,
                    storedSongProbabilities: {}
                },
                idValue = { id: true };
            
            let result1 = Capacity.IsCapacity(bool);
            let result2 = Capacity.IsCapacity(num);
            let result3 = Capacity.IsCapacity(notCapacity);
            let result4 = Capacity.IsCapacity(idValue);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
            expect(result4).to.equal(false);
        });
    });
});
