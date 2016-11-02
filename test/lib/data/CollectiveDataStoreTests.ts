import CollectiveDataStore from "../../../lib/data/CollectiveDataStore";
import StringSetCollectiveDataValue from "../../../lib/data/StringSetCollectiveDataValue";
import {CollectiveData} from "../../../shared/data";

import {Id} from "../../../shared/auth";

import chai = require("chai");


let expect = chai.expect;

/**
 * CollectiveDataStore Unit Tests
 */
describe("CollectiveDataStore", function () {
    // Test data
    let collectiveDataStore: CollectiveDataStore,
        collectiveData: CollectiveData,
        collectiveData2: CollectiveData,
        collectiveDataId: Id = "ArbitraryCollectiveDataId",
        valueId: Id = "ArbitraryValueId",
        stringSetValue1: StringSetCollectiveDataValue = new StringSetCollectiveDataValue("1", { "a": true }),
        stringSetValue2: StringSetCollectiveDataValue = new StringSetCollectiveDataValue("2", {  }),
        stringSetValue3: StringSetCollectiveDataValue = new StringSetCollectiveDataValue("3", { "a": true, "b": true, "c": true });;

    /**
     * Set up before each test
     */
    beforeEach(function () {
        collectiveDataStore = new CollectiveDataStore();
        collectiveData = new CollectiveData(collectiveDataId);
        collectiveData2 = new CollectiveData(collectiveData.id);
    });

    /**
     * get() Test Cases
     */
    describe("get()", function () {
        it("should return null for non-existent collective data", function () {
            let result = collectiveDataStore.get(collectiveDataId, valueId);
            expect(result).to.equal(null);
        });

        it("should return stored values", function () {
            collectiveData.put(stringSetValue1);
            collectiveData.put(stringSetValue2);
            collectiveData.put(stringSetValue3);

            collectiveDataStore.set(collectiveData);
            
            let result1 = collectiveDataStore.get(collectiveData.id, stringSetValue1.id);
            let result2 = collectiveDataStore.get(collectiveData.id, stringSetValue2.id);
            let result3 = collectiveDataStore.get(collectiveData.id, stringSetValue3.id);
            
            expect(result1).to.equal(stringSetValue1);
            expect(result2).to.equal(stringSetValue2);
            expect(result3).to.equal(stringSetValue3);
        });
    });

    /**
     * put() Test Cases
     */
    describe("put()", function () {
        it("should return false and store no value for invalid collective data id", function () {
            let collectiveDataStore = new CollectiveDataStore(),
                collectiveDataId = "InvalidCollectiveDataId",
                stringSetValue = new StringSetCollectiveDataValue("3", { "a": true, "b": true, "c": true });
            
            let putResult = collectiveDataStore.put(collectiveDataId, stringSetValue);
            let datastore = collectiveDataStore.getDatastore();

            expect(putResult).to.equal(false);
            expect(datastore).to.not.have.property(collectiveDataId);
        });

        it("should return true and store value for valid collective data id and new value", function () {
            collectiveDataStore.set(collectiveData);

            let putResult = collectiveDataStore.put(collectiveData.id, stringSetValue3);
            let datastore = collectiveDataStore.getDatastore();

            expect(putResult).to.equal(true);
            expect(datastore).to.have.property(collectiveData.id);

            expect(datastore[collectiveData.id]).to.equal(collectiveData);

            let data = datastore[collectiveData.id].getData();
            expect(data).to.not.equal(null);
            expect(data).to.have.property(stringSetValue3.id);
            expect(data[stringSetValue3.id]).to.equal(stringSetValue3);
        });
    });

    /**
     * set() Test Cases
     */
    describe("set()", function() {
        it("should store a new collective data", function () {
            collectiveData.put(stringSetValue1);
            collectiveData.put(stringSetValue2);
            collectiveData.put(stringSetValue3);
            
            let setResult = collectiveDataStore.set(collectiveData);
            let datastore = collectiveDataStore.getDatastore();
            
            expect(setResult).to.equal(true);
            expect(datastore).to.not.equal(null);
            expect(datastore).to.have.property(collectiveData.id);
            expect(datastore[collectiveData.id]).to.equal(collectiveData);
        });
        
        it("should overwrite an existing collective data", function () {
            collectiveData.put(stringSetValue1);
            collectiveData.put(stringSetValue2);
            collectiveData.put(stringSetValue3);

            collectiveData2.put(stringSetValue2);

            collectiveDataStore.set(collectiveData);
            
            let setResult = collectiveDataStore.set(collectiveData2);
            let datastore = collectiveDataStore.getDatastore();
            
            expect(setResult).to.equal(true);
            expect(datastore).to.not.equal(null);
            expect(datastore).to.have.property(collectiveData.id);
            expect(datastore[collectiveData.id]).to.equal(collectiveData2);
        });
    });
});
