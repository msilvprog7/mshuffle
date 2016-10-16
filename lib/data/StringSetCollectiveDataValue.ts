import {CollectiveDataValue, StringSet} from "../../shared/data";

import {Id} from "../../shared/auth";


/**
 * A StringSetCollectiveDataValue
 */
export default class StringSetCollectiveDataValue extends CollectiveDataValue {
    /**
     * Create an instance of a StringSetCollectiveDataValue
     * @param id Id
     * @param value StringSet
     */
    constructor(id: Id, public readonly value: StringSet) {
        super(id);
    }

    /**
     * Add the value to the current value
     */
    add(value: CollectiveDataValue): boolean {
        Object.keys(value).forEach(id => this.value[id] = true);
        return true;
    }

    /**
     * StringSetCollectiveDataValue's type guard
     */
    public static IsStringSetCollectiveDataValue(set: any): set is StringSetCollectiveDataValue {
        return (set !== undefined &&
            set !== null &&
            "id" in set &&
            "value" in set);
    }
}
