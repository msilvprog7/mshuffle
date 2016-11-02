/**
 * Mock data for display related interfaces
 */

import {DisplayFeature} from "../../shared/display";

import {Id} from "../../shared/auth";


/**
 * DisplayFeature mocks
 */
export class MockDisplayFeature extends DisplayFeature {
    /**
     * Construct a mock display feature
     */
    constructor(id: Id) {
        super(id);
    }

    /**
     * Make a display feature mock
     */
    public static make(id: Id): DisplayFeature {
        return new MockDisplayFeature(id);
    }
}
