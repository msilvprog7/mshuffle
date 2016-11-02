import {SatisfactionAdjustmentFactor, SatisfactionAdjustmentFactorSet, SatisfactionSessionData} from "../../../shared/features/satisfaction";

import {MockSatisfactionAdjustmentFactor, MockSatisfactionAdjustmentFactorSet, MockSatisfactionSessionData} from "../../mock/features/satisfaction";

import {Song} from "../../../shared/music";

import chai = require("chai");


let expect = chai.expect;

/**
 * SatisfactionAdjustmentFactor Unit Tests
 */
describe("SatisfactionAdjustmentFactor", function () {
    /**
     * IsSatisfactionAdjustmentFactor() Test Cases
     */
    describe("IsSatisfactionAdjustmentFactor()", function () {
        it("should return true for valid SatisfactionAdjustmentFactors", function () {
            let satisfactionAdjustmentFactor = MockSatisfactionAdjustmentFactor.makeFixedProb(0),
                satisfactionAdjustmentFactor2 = MockSatisfactionAdjustmentFactor.makeFixedProb(0.2),
                satisfactionAdjustmentFactor3 = MockSatisfactionAdjustmentFactor.makeFixedProb(1.0);
            
            let result1 = SatisfactionAdjustmentFactor.IsSatisfactionAdjustmentFactor(satisfactionAdjustmentFactor);
            let result2 = SatisfactionAdjustmentFactor.IsSatisfactionAdjustmentFactor(satisfactionAdjustmentFactor2);
            let result3 = SatisfactionAdjustmentFactor.IsSatisfactionAdjustmentFactor(satisfactionAdjustmentFactor3);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
        });

        it("should return false for invalid SatisfactionAdjustmentFactor", function () {
            let bool = true,
                num = 27,
                notFactor = {
                    enjoy: 2,
                    dislike: "7"
                };
            
            let result1 = SatisfactionAdjustmentFactor.IsSatisfactionAdjustmentFactor(bool);
            let result2 = SatisfactionAdjustmentFactor.IsSatisfactionAdjustmentFactor(num);
            let result3 = SatisfactionAdjustmentFactor.IsSatisfactionAdjustmentFactor(notFactor);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
        });
    });
});

/**
 * SatisfactionAdjustmentFactorSet Unit Tests
 */
describe("SatisfactionAdjustmentFactorSet", function () {
    /**
     * IsSatisfactionAdjustmentFactorSet() Test Cases
     */
    describe("IsSatisfactionAdjustmentFactorSet()", function () {
        it("should return true for valid SatisfactionAdjustmentFactorSets", function () {
            let satisfactionAdjustmentFactorSet = MockSatisfactionAdjustmentFactorSet.makeFixedProb(0),
                satisfactionAdjustmentFactorSet2 = MockSatisfactionAdjustmentFactorSet.makeFixedProb(0.2),
                satisfactionAdjustmentFactorSet3 = MockSatisfactionAdjustmentFactorSet.makeFixedProb(1.0);
            
            let result1 = SatisfactionAdjustmentFactorSet.IsSatisfactionAdjustmentFactorSet(satisfactionAdjustmentFactorSet);
            let result2 = SatisfactionAdjustmentFactorSet.IsSatisfactionAdjustmentFactorSet(satisfactionAdjustmentFactorSet2);
            let result3 = SatisfactionAdjustmentFactorSet.IsSatisfactionAdjustmentFactorSet(satisfactionAdjustmentFactorSet3);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
        });

        it("should return false for invalid SatisfactionAdjustmentFactorSets", function () {
            let bool = true,
                num = 27,
                notSet = {
                    song: MockSatisfactionAdjustmentFactor.makeFixedProb(0.0),
                    album: MockSatisfactionAdjustmentFactor.makeFixedProb(0.2),
                    artist: MockSatisfactionAdjustmentFactor.makeFixedProb(1),
                    similarArtist: {
                        enjoy: "not correct",
                        dislike: (song: Song, probability: number) => 0.23
                    }
                };
            
            let result1 = SatisfactionAdjustmentFactorSet.IsSatisfactionAdjustmentFactorSet(bool);
            let result2 = SatisfactionAdjustmentFactorSet.IsSatisfactionAdjustmentFactorSet(num);
            let result3 = SatisfactionAdjustmentFactorSet.IsSatisfactionAdjustmentFactorSet(notSet);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
        });
    });
});

/**
 * SatisfactionSessionData Unit Tests
 */
describe("SatisfactionSessionData", function () {
    /**
     * IsSatisfactionSessionData() Test Cases
     */
    describe("IsSatisfactionSessionData()", function () {
        it("should return true for valid SatisfactionSessionDatas", function () {
            let satisfactionSessionData = MockSatisfactionSessionData.make(
                    "SessionData1",
                    MockSatisfactionAdjustmentFactorSet.makeFixedProb(0.1),
                    { },
                    { }),
                satisfactionSessionData2 = MockSatisfactionSessionData.make(
                    "SessionData2",
                    MockSatisfactionAdjustmentFactorSet.makeFixedProb(0.1),
                    { },
                    { "a": { "b": true, "c": true}, "d": { } }),
                satisfactionSessionData3 = MockSatisfactionSessionData.make(
                    "SessionData3",
                    MockSatisfactionAdjustmentFactorSet.makeFixedProb(0.1),
                    { "a": { "b": true, "c": true}, "d": { } },
                    { }),
                satisfactionSessionData4 = MockSatisfactionSessionData.make(
                    "SessionData4",
                    MockSatisfactionAdjustmentFactorSet.makeFixedProb(0.1),
                    { "a": { "b": true, "c": true}, "d": { } },
                    { "a": { "b": true, "c": true}, "d": { } });
            
            let result1 = SatisfactionSessionData.IsSatisfactionSessionData(satisfactionSessionData);
            let result2 = SatisfactionSessionData.IsSatisfactionSessionData(satisfactionSessionData2);
            let result3 = SatisfactionSessionData.IsSatisfactionSessionData(satisfactionSessionData3);
            let result4 = SatisfactionSessionData.IsSatisfactionSessionData(satisfactionSessionData4);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
            expect(result4).to.equal(true);
        });

        it("should return false for invalid SatisfactionSessionDatas", function () {
            let bool = true,
                num = 27,
                notSessionData = { 
                    id: "id",
                    adjustments: MockSatisfactionAdjustmentFactorSet.makeFixedProb(0.1),
                    albumSongs: { "a": { "b": true, "c": true}, "d": { } },
                    artistSongs: { "b": { "b": 1 }}
                };
            
            let result1 = SatisfactionSessionData.IsSatisfactionSessionData(bool);
            let result2 = SatisfactionSessionData.IsSatisfactionSessionData(num);
            let result3 = SatisfactionSessionData.IsSatisfactionSessionData(notSessionData);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
        });
    });
});
