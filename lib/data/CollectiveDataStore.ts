import {BaseCollectiveDataStore, CollectiveData, CollectiveDataValue, IdToCollectiveData} from "../../shared/data";

import {Id} from "../../shared/auth";


/**
 * Collective Data Store
 */
export default class CollectiveDataStore extends BaseCollectiveDataStore {
    /**
     * Id for Artist to Related Artists mapping
     */
    public static SimilarArtistsId = "SimilarArtists";

    /**
     * Id mapping to Collective Data Store
     */
    private datastore: IdToCollectiveData;

    /**
     * Create an instance of a CollectiveDataStore
     */
    constructor() {
        super();
        this.datastore = {};
    }

    /**
     * Get the value from the desired collective data
     * @param collectiveDataId The Id of the Collective Data desired
     * @param valueId The Id of the Value wanted from the data
     * @returns The Collective Data Value or null
     */
    get(collectiveDataId: Id, valueId: Id): CollectiveDataValue | null {
        let data = this.datastore[collectiveDataId];
        if (data === undefined || data === null) {
            return null;
        }

        return data.get(valueId);
    }

    /**
     * Put the value into the desired collective data
     * @param collectiveDataId The Id of the Collective Data to place value
     * @param value The value to place in the Collective Data
     * @returns Whether the value was added or not
     */
    put(collectiveDataId: Id, value: CollectiveDataValue): boolean {
        let data = this.datastore[collectiveDataId];
        if (data === undefined || data === null) {
            return false;
        }

        return data.put(value);
    }

    /**
     * Set the Collective Data in the data store
     * @param collectiveData The CollectiveData to set
     * @returns Whether the data was added or not
     */
    set(collectiveData: CollectiveData): boolean {
        this.datastore[collectiveData.id] = collectiveData;
        return true;
    }
}
