/**
 * Generic data type aliases and interfaces
 */

import {Id, Identifiable} from "./auth";


/**
 * Abstract class for a CollectiveDataStore
 */
export abstract class BaseCollectiveDataStore {
    /**
     * Get the value from the desired collective data
     * @param collectiveDataId The Id of the Collective Data desired
     * @param valueId The Id of the Value wanted from the data
     * @returns The Collective Data Value or null
     */
    abstract get(collectiveDataId: Id, valueId: Id): CollectiveDataValue | null;

    /**
     * Put the value into the desired collective data
     * @param collectiveDataId The Id of the Collective Data to place value
     * @param value The value to place in the Collective Data
     * @returns Whether the value was added or not
     */
    abstract put(collectiveDataId: Id, value: CollectiveDataValue): boolean;

    /**
     * Set the Collective Data in the data store
     * @param collectiveData The CollectiveData to set
     * @returns Whether the data was added or not
     */
    abstract set(collectiveData: CollectiveData): boolean;
}

/**
 * Base interface for ChartData
 */
export interface ChartData {
}

/**
 * Abstract class for a CollectiveData type
 */
export class CollectiveData extends Identifiable {
    /**
     * CollectiveDataValues
     */
    private data: IdToCollectiveDataValue;

    /**
     * Create an instance of CollectiveData
     */
    constructor(public readonly id) {
        super();
        this.data = {};
    }

    /**
     * Get the value by Id
     * @param valueId Id of the value to retrieve
     * @returns The CollectiveDataValue or null
     */
    get(valueId: Id): CollectiveDataValue | null {
        if (this.data[valueId] !== undefined) {
            return this.data[valueId];
        }

        return null;
    }

    /**
     * Put the value into the data
     * @param value The CollectionDataValue to add
     * @returns Whether the value was added or not
     */
    put(value: CollectiveDataValue): boolean {
        let valueStored = this.data[value.id];
        if (valueStored === undefined || valueStored === null) {
            this.data[value.id] = value;
            return true;
        } else {
            return valueStored.add(value);
        }
    }
}

/**
 * Collective Data Value for storage and retrieval
 */
export abstract class CollectiveDataValue extends Identifiable {
    /**
     * Create an instance of a CollectiveDataValue
     * @param id Id
     */
    constructor(public readonly id: Id) {
        super();
    }

    /**
     * Add the value to the current value
     */
    abstract add(value: CollectiveDataValue): boolean;
}

/**
 * ChartData for PMF Data
 */
export interface PMFData extends ChartData {
    data: LabeledDataValue[];
}

/**
 * Static PMF data functions
 */
export class PMFData {
    public static IsPMF(pmf: any): pmf is PMFData {
        return (pmf !== undefined &&
            pmf !== null &&
            "data" in pmf &&
            LabeledDataValue.AreLabeledDataValues(pmf.data));
    }
}

/**
 * Indexer for probabilities
 */
export interface Probabilities {
    [index: string]: LabeledDataValue;
}

/**
 * Indexer from id to CollectiveData
 */
export interface IdToCollectiveData {
    [index: string]: CollectiveData;
}

/**
 * Indexer from id to CollectiveDataValue
 */
export interface IdToCollectiveDataValue {
    [index: string]: CollectiveDataValue;
}

/**
 * Indexer from id to number
 */
export interface IdToNumber {
    [index: string]: number;
}

/**
 * Indexer from id to string set
 */
export interface IdToStringSet {
    [index: string]: StringSet;
}

/**
 * Indexer from id to value of type specified
 */
export interface IdToValue<T> {
    [index: string]: T;
}

/**
 * Interface for a labeled Data value
 */
export interface LabeledDataValue {
    /**
     * Label to identify the value
     */
    label: string;

    /**
     * Probability value
     */
    value: number;
}

/**
 * Static LabeledDataValue functions
 */
export class LabeledDataValue {
    /**
     * LabeledDataValue[] type guard
     */
    public static AreLabeledDataValues(values: any): values is LabeledDataValue[] {
        if (!(values instanceof Array)) {
            return false;
        }

        for (let value of values) {
            if (!LabeledDataValue.IsLabeledDataValue(value)) {
                return false;
            }
        }

        return true;
    }
    
    /**
     * Convert to LabeledDataValue[]
     */
    public static GetLabledDataValues(values: any): LabeledDataValue[] {
        let results: LabeledDataValue[] = [];
        
        if (values instanceof Array) {
            for (let value of values) {
                if (LabeledDataValue.IsLabeledDataValue(value)) {
                    results.push(value);
                }
            }
        }

        return results;
    }

    /**
     * LabeledDataValue's type guard
     */
    public static IsLabeledDataValue(value: any): value is LabeledDataValue {
        return (value !== undefined &&
            value !== null &&
            "label" in value &&
            "value" in value);
    }
}

/**
 * Interface for a Name and an associated Value
 */
export interface NameValue<V> {
    name: string;
    value: V;
}

/**
 * Interface for a Set of strings, mocked using
 * an indexer from string to booleans
 */
export interface StringSet {
    [index: string]: boolean;
}
