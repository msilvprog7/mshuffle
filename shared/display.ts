/**
 * Display type aliases and interfaces
 */

import {Id, Identifiable} from "./auth";
import * as $ from "jquery";


/**
 * Enum of colors
 */
export enum Color {
    Blue,
    Pink,
    Green,
    Orange,
    LightGreen,
    LightPurple
}

/**
 * Number of colors in Color enum
 */
export const ColorsAvailable = 6;

/**
 * Indexer for Display Features
 */
export interface DisplayFeatures {
    /**
     * Id to Display Feature
     */
    [index: string]: DisplayFeature;
}

/**
 * Interface for RGB values
 */
export interface rgb {
    r: number;
    g: number;
    b: number;
}

/**
 * Interface for RGBA values
 */
export interface rgba extends rgb {
    a: number;
}

/**
 * Abstract class for a Display Feature
 */
export abstract class DisplayFeature implements Identifiable {
    /**
     * Features to display
     */
    protected displayFeatures: DisplayFeatures;

    private parent: DisplayFeature | null;

    /**
     * Create a new instance of a Display Feature
     * @param id Id
     */
    constructor(public readonly id: Id) {
        this.displayFeatures = {};
        this.parent = null;
    }

    /**
     * Add the Display Feature using its id from
     * the children of this Display Feature
     * @displayFeature Display Feature to add
     */
    add(displayFeature: DisplayFeature): void {
        this.displayFeatures[displayFeature.id] = displayFeature;
        displayFeature.setParent(this);
    }

    /**
     * Perform an operation on Display Features contained in this 
     * DisplayFeature and all children with the specified id
     * @param displayFeatureId Id for DisplayFeatures to perform the operation on
     * @param operation Operation to perform
     */
    cascade(displayFeatureId: Id, operation: (displayFeature: DisplayFeature) => void): void {
        if (this.id === displayFeatureId) {
            operation(this);
        }

        this.getFeatures().forEach(feature => feature.cascade(displayFeatureId, operation));
    }

    /**
     * Clear the Display Feature of content, typically
     * called via cascading
     */
    clear(): void {
    }

    /**
     * Clear Display Features with the id in a cascading fashion
     * @param displayFeatureId Id to clear
     */
    clearCascade(displayFeatureId: Id): void {
        this.cascade(displayFeatureId, (displayFeature: DisplayFeature) => displayFeature.clear());
    }

    /**
     * Fill the Display Feature with some form of content (should type
     * guard), typically called via cascading
     * @param content Content to fill
     */
    fill(content: any): void {
    }

    /**
     * Fill Display Features with the id in a cascading fashion
     * @param displayFeatureId Id to fill
     * @param content Content to fill
     */
    fillCascade(displayFeatureId: Id, content: any): void {
        this.cascade(displayFeatureId, (displayFeature: DisplayFeature) => displayFeature.fill(content));
    }

    /**
     * Get the root display feature, including the current
     * display feature if it is the root
     * @returns Root Display Feature
     */
    getRootDisplayFeature() {
        let root: DisplayFeature = this;

        while (root.parent !== null) {
            root = root.parent;
        }

        return root;
    }

    /**
     * Hide the Display Feature and all of its components
     */
    hide(): void {
        this.getFeatures().forEach(feature => feature.hide());
    }

    /**
     * Hide Display Features with the id in a cascading fashion
     * @param displayFeatureId Id to hide
     */
    hideCascade(displayFeatureId: Id): void {
        this.cascade(displayFeatureId, (displayFeature: DisplayFeature) => displayFeature.hide());
    }

    /**
     * Remove the Display Feature using its id from
     * the children of this Display Feature
     */
    remove(displayFeatureId: Id): void {
        delete this.displayFeatures[displayFeatureId];
    }

    /**
     * Get the parent display feature
     */
    getParent() {
        return this.parent;
    }

    /**
     * Set the parent display feature
     */
    setParent(displayFeature: DisplayFeature) {
        this.parent = displayFeature;
    }

    /**
     * Show the Display Feature and all of its components
     */
    show(): void {
        this.getFeatures().forEach(feature => feature.show());
    }

    /**
     * Show Display Features with the id in a cascading fashion
     * @param displayFeatureId Id to show
     */
    showCascade(displayFeatureId: Id): void {
        this.cascade(displayFeatureId, (displayFeature: DisplayFeature) => displayFeature.show());
    }

    /**
     * Get the display features that compose this feature
     */
    getFeatures(): DisplayFeature[] {
        return Object.keys(this.displayFeatures).map(key => this.displayFeatures[key]);
    }
}

/**
 * Abstract class for interacting with the site's 
 * displayed content
 */
export abstract class DisplayAPI extends DisplayFeature {
    /**
     * Create an instance of DisplayAPI
     * @param id Identifier of DisplayAPI as a Display Feature
     */
    constructor(public id: Id) {
        super(id);
    }
}

/**
 * Class for static color related functionality
 */
export class Colors {
    /**
     * Get the rgb value for a color
     */
    static GetRGB(color: Color): rgb {
        switch (color) {
            case Color.Blue:
			    return {r: 39, g: 128, b: 227};
			case Color.Pink: 
                return {r: 227, g: 39, b: 128};
			case Color.Green:
                return {r: 128, g: 227, b: 39};
			case Color.Orange:
                return {r: 227, g: 138, b: 39};
			case Color.LightGreen:
                return {r: 39, g: 227, b: 138};
			case Color.LightPurple:
                return {r: 138, g: 39, b: 227};
            default:
                return {r: 0, g: 0, b: 0};
		}
    }

    static GetRGBA(rgb: rgb, alpha: number): rgba {
        return {r: rgb.r, g: rgb.g, b: rgb.b, a: alpha};
    }

    /**
     * Format an rgba value to an 'rgba(r,g,b,a)' string
     * (e.g. {r: 1, g: 2, b: 3, a: 0.45} => 'rgba(1,2,3,0.45)')
     */
    static GetRGBAString(rgba: rgba): string {
        return `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`
    }

    /**
     * Returns a Color enum value randomly
     */
    static GetRandomColor(): Color {
        return (Math.floor(Math.random() * ColorsAvailable));
    }
}
