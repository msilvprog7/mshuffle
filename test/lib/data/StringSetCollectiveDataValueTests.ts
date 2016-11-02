import StringSetCollectiveDataValue from "../../../lib/data/StringSetCollectiveDataValue";
import {CollectiveData, StringSet} from "../../../shared/data";

import chai = require("chai");


let expect = chai.expect;

/**
 * StringSetCollectiveDataValue Unit Tests
 */
describe("StringSetCollectiveDataValue", function () {
    // Test data
    let collectiveDataValue: StringSetCollectiveDataValue,
        collectiveDataValue2: StringSetCollectiveDataValue,
        collectiveDataValue3: StringSetCollectiveDataValue,
        collectiveDataValue4: StringSetCollectiveDataValue,
        additions = { "a": true, "b": true, "c": true },
        additions2 = { "b": true, "c": true, "d": true },
        existing = { "a": true, "b": true },
        mergedExistingAndAdditions2 = { "a": true, "b": true, "c": true, "d": true };
    
    /**
     * Set up before each test
     */
    beforeEach(function () {
        collectiveDataValue = new StringSetCollectiveDataValue("1");
        collectiveDataValue2 = new StringSetCollectiveDataValue("2", additions);
        collectiveDataValue3 = new StringSetCollectiveDataValue("3", additions2);
        collectiveDataValue4 = new StringSetCollectiveDataValue("4", existing);
    });

    /**
     * add() Test Cases
     */
    describe("add()", function () {
        it("should add values and return true", function () {
            let result = collectiveDataValue.add(collectiveDataValue2);
            let value = collectiveDataValue.value;

            expect(result).to.equal(true);
            expect(value).to.deep.equal(additions);
        });

        it("should merge existing values and return true", function () {
            let result = collectiveDataValue3.add(collectiveDataValue4);
            let value = collectiveDataValue3.value;

            expect(result).to.equal(true);
            expect(value).to.deep.equal(mergedExistingAndAdditions2);
        });
    });

    /**
     * IsStringSetCollectiveDataValue() Test Cases
     */
    describe("IsStringSetCollectiveDataValue()", function () {
        it("should return true for valid StringSetCollectiveDataValues", function () {
            collectiveDataValue2.add(new StringSetCollectiveDataValue("5", additions2));
            
            let result1 = StringSetCollectiveDataValue.IsStringSetCollectiveDataValue(collectiveDataValue);
            let result2 = StringSetCollectiveDataValue.IsStringSetCollectiveDataValue(collectiveDataValue2);
            let result3 = StringSetCollectiveDataValue.IsStringSetCollectiveDataValue(collectiveDataValue3);
            let result4 = StringSetCollectiveDataValue.IsStringSetCollectiveDataValue(collectiveDataValue4);
            
            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
            expect(result4).to.equal(true);
        });

        it("should return false for invalid StringSetCollectiveDataValues", function () {
            let bool = true,
                num = 27,
                collectiveData = new CollectiveData("ArbitraryCollectiveDataId"),
                valueWithoutId = { "value": true },
                idWithoutValue = { "id": true };
            
            let result1 = StringSetCollectiveDataValue.IsStringSetCollectiveDataValue(bool);
            let result2 = StringSetCollectiveDataValue.IsStringSetCollectiveDataValue(num);
            let result3 = StringSetCollectiveDataValue.IsStringSetCollectiveDataValue(collectiveData);
            let result4 = StringSetCollectiveDataValue.IsStringSetCollectiveDataValue(valueWithoutId);
            let result5 = StringSetCollectiveDataValue.IsStringSetCollectiveDataValue(idWithoutValue);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
            expect(result4).to.equal(false);
            expect(result5).to.equal(false);
        });
    });
});
