import {CollectiveData, IdToNumber, IdToStringSet, LabeledDataValue, PMFData, StringSet} from "../../shared/data";

import StringSetCollectiveDataValue from "../../lib/data/StringSetCollectiveDataValue";

import chai = require("chai");


let expect = chai.expect;

/**
 * CollectiveData Unit Tests
 */
describe("CollectiveData", function () {
    // Test data
    let collectiveData1 = new CollectiveData("CollectiveData1"),
        collectiveData2,
        collectiveData3,
        stringSetCollectiveDataValue1 = new StringSetCollectiveDataValue("Value1", { }),
        stringSetCollectiveDataValue2 = new StringSetCollectiveDataValue(
            "Value2", 
            { "a": true, "b": true, "c": true }),
        stringSetCollectiveDataValue3 = new StringSetCollectiveDataValue(
            "Value3",
            { "d": true, "e": true });
    
    /**
     * Set up before each test case
     */
    beforeEach(function () {
        collectiveData2 = new CollectiveData("CollectiveData2");
        collectiveData2.put(stringSetCollectiveDataValue1);
        collectiveData3 = new CollectiveData("CollectiveData3");
        collectiveData3.put(stringSetCollectiveDataValue1);
        collectiveData3.put(stringSetCollectiveDataValue2);
    });

    /**
     * get() Test Cases
     */
    describe("get()", function () {
        it("should return value if stored", function () {
            let result1 = collectiveData2.get(stringSetCollectiveDataValue1.id);
            let result2 = collectiveData3.get(stringSetCollectiveDataValue1.id);
            let result3 = collectiveData3.get(stringSetCollectiveDataValue2.id);

            expect(result1).to.not.equal(null);
            expect(result1).to.deep.equal(stringSetCollectiveDataValue1);

            expect(result2).to.not.equal(null);
            expect(result2).to.deep.equal(stringSetCollectiveDataValue1);

            expect(result3).to.not.equal(null);
            expect(result3).to.deep.equal(stringSetCollectiveDataValue2);
        });

        it("should return null if not stored", function () {
            let result1 = collectiveData1.get(stringSetCollectiveDataValue1.id);
            let result2 = collectiveData1.get(stringSetCollectiveDataValue2.id);
            let result3 = collectiveData2.get(stringSetCollectiveDataValue2.id);

            expect(result1).to.equal(null);
            expect(result2).to.equal(null);
            expect(result3).to.equal(null);
        });
    });

    /**
     * put() Test Cases
     */
    describe("put()", function () {
        it("should put a new value into the store", function () {
            collectiveData2.put(stringSetCollectiveDataValue3);

            let result = collectiveData2.getData();

            let keys = Object.keys(result);
            expect(keys).to.have.length(2);
            expect(keys[1]).to.equal(stringSetCollectiveDataValue3.id);
            expect(result[keys[1]]).to.deep.equal(stringSetCollectiveDataValue3);
        });
    });

    /**
     * getData() Test Cases
     */
    describe("getData()", function () {
        it("should get the values stored", function () {
            let result1 = collectiveData1.getData();
            let result2 = collectiveData2.getData();
            let result3 = collectiveData3.getData();
            
            expect(result1).to.not.equal(null);
            let keys1 = Object.keys(result1);
            expect(keys1).to.have.length(0);
            
            expect(result2).to.not.equal(null);
            let keys2 = Object.keys(result2);
            expect(keys2).to.have.length(1);
            expect(keys2[0]).to.equal(stringSetCollectiveDataValue1.id);
            expect(result2[keys2[0]]).to.deep.equal(stringSetCollectiveDataValue1);

            expect(result3).to.not.equal(null);
            let keys3 = Object.keys(result3);
            expect(keys3).to.have.length(2);
            expect(keys3[0]).to.equal(stringSetCollectiveDataValue1.id);
            expect(result3[keys3[0]]).to.deep.equal(stringSetCollectiveDataValue1);
            expect(keys3[1]).to.equal(stringSetCollectiveDataValue2.id);
            expect(result3[keys3[1]]).to.deep.equal(stringSetCollectiveDataValue2);
        });
    });
});

/**
 * PMFData Unit Tests
 */
describe("PMFData", function () {
    /**
     * IsPMF() Test Cases
     */
    describe("IsPMF()", function () {
        it("should return true for pmf datas", function () {
            let value1 = { "data": [] },
                value2 = { "data": [ { "label": "a", "value": 1.0 } ] },
                value3 = { "data": [
                    { "label": "a", "value": 1.0 },
                    { "label": "b", "value": 2.0 },
                    { "label": "c", "value": 3.0 }
                ]};
            
            let result1 = PMFData.IsPMF(value1);
            let result2 = PMFData.IsPMF(value2);
            let result3 = PMFData.IsPMF(value3);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
        });

        it("should return false for not pmf datas", function () {
            let notValue1 = false,
                notValue2 = 27.6,
                notValue3 = [ 
                    { "label": "a", "value": 1.0 },
                    { "label": "b", "value": 2.0 },
                    { "label": "c", "value": 3.0 }],
                notValue4 = {
                    "data": ["string", "String", "STRING"]
                };
            
            let result1 = PMFData.IsPMF(notValue1);
            let result2 = PMFData.IsPMF(notValue2);
            let result3 = PMFData.IsPMF(notValue3);
            let result4 = PMFData.IsPMF(notValue4);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
            expect(result4).to.equal(false);
        });
    });
});

/**
 * IdToNumber Unit Tests
 */
describe("IdToNumber", function () {
    /**
     * IsIdToNumber() Test Cases
     */
    describe("IsIdToNumber()", function () {
        it("should return true for id to numbers", function () {
            let value1 = { },
                value2 = { "1": 2 },
                value3 = { "1": 0, "2": 1, "0": 2 };
            
            let result1 = IdToNumber.IsIdToNumber(value1);
            let result2 = IdToNumber.IsIdToNumber(value2);
            let result3 = IdToNumber.IsIdToNumber(value3);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
        });

        it("should return false for not id to numbers", function () {
            let notValue1 = false,
                notValue2 = 27.6,
                notValue3 = [1, "string", false],
                notValue4 = { "12345": 1, "1234": false };
            
            let result1 = IdToNumber.IsIdToNumber(notValue1);
            let result2 = IdToNumber.IsIdToNumber(notValue2);
            let result3 = IdToNumber.IsIdToNumber(notValue3);
            let result4 = IdToNumber.IsIdToNumber(notValue4);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
            expect(result4).to.equal(false);
        });
    });
});

/**
 * IdToStringSet Unit Tests
 */
describe("IdToStringSet", function () {
    /**
     * IsIdToStringSet() Test Cases
     */
    describe("IsIdToStringSet()", function () {
        it("should return true for id to string sets", function () {
            let value1 = { },
                value2 = { "1": { } },
                value3 = { "1": { "b": true, "c": true }, "2": { }, "3": { "a": true } };
            
            let result1 = IdToStringSet.IsIdToStringSet(value1);
            let result2 = IdToStringSet.IsIdToStringSet(value2);
            let result3 = IdToStringSet.IsIdToStringSet(value3);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
        });

        it("should return false for not id to string sets", function () {
            let notValue1 = false,
                notValue2 = 27.6,
                notValue3 = [1, 2, 3],
                notValue4 = { "12345": { "a": true, "b": 1 } };
            
            let result1 = IdToStringSet.IsIdToStringSet(notValue1);
            let result2 = IdToStringSet.IsIdToStringSet(notValue2);
            let result3 = IdToStringSet.IsIdToStringSet(notValue3);
            let result4 = IdToStringSet.IsIdToStringSet(notValue4);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
            expect(result4).to.equal(false);
        });
    });
});

/**
 * LabeledDataValue Unit Tests
 */
describe("LabeledDataValue", function () {
    /**
     * AreLabeledDataValues() Test Cases
     */
    describe("AreLabeledDataValues()", function () {
        it("should return true for lists of labeled data values", function () {
            let value1 = [],
                value2 = [
                    { "label": "", "value": 1.0 }],
                value3 = [
                    { "label": "Hello", "value": -1.0 }, 
                    { "label": "There there", "value": 13 }, 
                    { "label": "!", "value": 0.0 }];
            
            let result1 = LabeledDataValue.AreLabeledDataValues(value1);
            let result2 = LabeledDataValue.AreLabeledDataValues(value2);
            let result3 = LabeledDataValue.AreLabeledDataValues(value3);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
        });

        it("should return false for not lists of labeled data values", function () {
            let notValue1 = false,
                notValue2 = 27.6,
                notValue3 = [1, 2, 3],
                notValue4 = [{ "label": true, "value": 1.2 }, false];
            
            let result1 = LabeledDataValue.AreLabeledDataValues(notValue1);
            let result2 = LabeledDataValue.AreLabeledDataValues(notValue2);
            let result3 = LabeledDataValue.AreLabeledDataValues(notValue3);
            let result4 = LabeledDataValue.AreLabeledDataValues(notValue4);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
            expect(result4).to.equal(false);
        });
    });

    /**
     * GetLabeledDataValues() Test Cases
     */
    describe("GetLabeledDataValues()", function () {
        it("should return labeled data values from object", function () {
            let testValue1 = false,
                testValue2 = { },
                testValue3 = [],
                testValue4 = [
                    { "label": "1", "value": 1.0 },
                    false,
                    { "label": "2", "value": 2.0 },
                    { "label": "3", "value": 3.0 }
                ];
            
            let expected1 = [],
                expected2 = [],
                expected3 = [],
                expected4 = [
                    { "label": "1", "value": 1.0 },
                    { "label": "2", "value": 2.0 },
                    { "label": "3", "value": 3.0 }
                ];
            
            let result1 = LabeledDataValue.GetLabledDataValues(testValue1);
            let result2 = LabeledDataValue.GetLabledDataValues(testValue2);
            let result3 = LabeledDataValue.GetLabledDataValues(testValue3);
            let result4 = LabeledDataValue.GetLabledDataValues(testValue4);

            expect(result1).to.deep.equal(expected1);
            expect(result2).to.deep.equal(expected2);
            expect(result3).to.deep.equal(expected3);
            expect(result4).to.deep.equal(expected4);
        });
    });

    /**
     * IsLabeledDataValue() Test Cases
     */
    describe("IsLabeledDataValue()", function () {
        it("should return true for labeled data values", function () {
            let value1 = { "label": "", "value": 1.0 },
                value2 = { "label": "Hello", "value": -1.0 },
                value3 = { "label": "There there", "value": 13 },
                value4 = { "label": "!", "value": 0.0 };
            
            let result1 = LabeledDataValue.IsLabeledDataValue(value1);
            let result2 = LabeledDataValue.IsLabeledDataValue(value2);
            let result3 = LabeledDataValue.IsLabeledDataValue(value3);
            let result4 = LabeledDataValue.IsLabeledDataValue(value4);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
            expect(result4).to.equal(true);
        });

        it("should return false for not labeled data values", function () {
            let notValue1 = false,
                notValue2 = 27.6,
                notValue3 = [1, 2, 3],
                notValue4 = { "label": true, "value": 1.2 };
            
            let result1 = LabeledDataValue.IsLabeledDataValue(notValue1);
            let result2 = LabeledDataValue.IsLabeledDataValue(notValue2);
            let result3 = LabeledDataValue.IsLabeledDataValue(notValue3);
            let result4 = LabeledDataValue.IsLabeledDataValue(notValue4);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
            expect(result4).to.equal(false);
        });
    });
});

/**
 * StringSet Unit Tests
 */
describe("StringSet", function () {
    /**
     * IsStringSet() Test Cases
     */
    describe("IsStringSet()", function () {
        it("should return true for string sets", function () {
            let value1 = { },
                value2 = { "A": true },
                value3 = { "A": true, "2": true },
                value4 = { "A": true, "2": true, "c": true };
            
            let result1 = StringSet.IsStringSet(value1);
            let result2 = StringSet.IsStringSet(value2);
            let result3 = StringSet.IsStringSet(value3);
            let result4 = StringSet.IsStringSet(value4);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
            expect(result4).to.equal(true);
        });

        it("should return false for not string sets", function () {
            let notValue1 = false,
                notValue2 = 27.6,
                notValue3 = [1, 2, 3],
                notValue4 = { "a": true, "b": 1.2 };
            
            let result1 = StringSet.IsStringSet(notValue1);
            let result2 = StringSet.IsStringSet(notValue2);
            let result3 = StringSet.IsStringSet(notValue3);
            let result4 = StringSet.IsStringSet(notValue4);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
            expect(result4).to.equal(false);
        });
    });
});
