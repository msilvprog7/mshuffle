/**
 * Chart type aliases and interfaces
 */

import {LabeledDataValue, ChartData} from "./data";


/**
 * Abstract class for site's use of Charts
 */
export abstract class ChartAPI<T extends ChartData> {
    /**
     * Create an instance of ChartAPI
     */
    constructor() {
    }

    /**
     * Load the data set
     * @param data Data to load
     */
    abstract load(data: T): void;

    /**
     * Reset the chart
     */
    abstract reset(): void;

    /**
     * Set the data set
     * @param data Data to set
     */
    abstract set(data: T): void;

    /**
     * Update the data set
     * @param data Data to update
     */
    abstract update(data: T): void;
}
