import {Color, Colors, ColorsAvailable, DisplayFeature} from "../../shared/display";

import {MockDisplayFeature} from "../mock/display";

import chai = require("chai");


let expect = chai.expect;

/**
 * Colors Unit Tests
 */
describe("Colors", function () {
    // Test data
    let testColor1 = Color.Blue,
        testColor2 = Color.Orange,
        testColor3 = Color.LightGreen,
        testColor4 = 2016;

    /**
     * GetRGB() Test Cases
     */
    describe("GetRGB()", function () {
        it("should always return some color, default black", function () {
            let result1 = Colors.GetRGB(testColor1);
            let result2 = Colors.GetRGB(testColor2);
            let result3 = Colors.GetRGB(testColor3);
            let result4 = Colors.GetRGB(testColor4);

            expect(result1).to.have.property("r");
            expect(typeof(result1.r)).to.equal("number");
            expect(result1.r).to.not.equal(0);
            expect(result1).to.have.property("g");
            expect(typeof(result1.g)).to.equal("number");
            expect(result1.g).to.not.equal(0);
            expect(result1).to.have.property("b");
            expect(typeof(result1.b)).to.equal("number");
            expect(result1.b).to.not.equal(0);

            expect(result2).to.have.property("r");
            expect(typeof(result2.r)).to.equal("number");
            expect(result2.r).to.not.equal(0);
            expect(result2).to.have.property("g");
            expect(typeof(result2.g)).to.equal("number");
            expect(result2.g).to.not.equal(0);
            expect(result2).to.have.property("b");
            expect(typeof(result2.b)).to.equal("number");
            expect(result2.b).to.not.equal(0);

            expect(result3).to.have.property("r");
            expect(typeof(result3.r)).to.equal("number");
            expect(result3.r).to.not.equal(0);
            expect(result3).to.have.property("g");
            expect(typeof(result3.g)).to.equal("number");
            expect(result3.g).to.not.equal(0);
            expect(result3).to.have.property("b");
            expect(typeof(result3.b)).to.equal("number");
            expect(result3.b).to.not.equal(0);

            expect(result4).to.have.property("r");
            expect(typeof(result4.r)).to.equal("number");
            expect(result4.r).to.equal(0);
            expect(result4).to.have.property("g");
            expect(typeof(result4.g)).to.equal("number");
            expect(result4.g).to.equal(0);
            expect(result4).to.have.property("b");
            expect(typeof(result4.b)).to.equal("number");
            expect(result4.b).to.equal(0);
        });
    });

    /**
     * GetRGBA() Test Cases
     */
    describe("GetRGBA()", function () {
        it("should add the alpha property to the object", function () {
            let expectedAlpha1 = 0.0,
                expectedAlpha2 = 0.4,
                expectedAlpha3 = 0.577,
                expectedAlpha4 = 1.0;
            
            let result1 = Colors.GetRGBA(Colors.GetRGB(testColor1), expectedAlpha1);
            let result2 = Colors.GetRGBA(Colors.GetRGB(testColor2), expectedAlpha2);
            let result3 = Colors.GetRGBA(Colors.GetRGB(testColor3), expectedAlpha3);
            let result4 = Colors.GetRGBA(Colors.GetRGB(testColor4), expectedAlpha4);

            expect(result1).to.have.property("r");
            expect(result1).to.have.property("g");
            expect(result1).to.have.property("b");
            expect(result1).to.have.property("a");
            expect(result1.a).to.equal(expectedAlpha1);

            expect(result2).to.have.property("r");
            expect(result2).to.have.property("g");
            expect(result2).to.have.property("b");
            expect(result2).to.have.property("a");
            expect(result2.a).to.equal(expectedAlpha2);

            expect(result3).to.have.property("r");
            expect(result3).to.have.property("g");
            expect(result3).to.have.property("b");
            expect(result3).to.have.property("a");
            expect(result3.a).to.equal(expectedAlpha3);

            expect(result4).to.have.property("r");
            expect(result4).to.have.property("g");
            expect(result4).to.have.property("b");
            expect(result4).to.have.property("a");
            expect(result4.a).to.equal(expectedAlpha4);
        });
    });

    /**
     * GetRGBAString() Test Cases
     */
    describe("GetRGBAString()", function () {
        it("should return an rgba formatted string for rgba values", function () {
            let test1 = { r: 0, g: 1, b: 2, a: 0.0 },
                test2 = { r: 255, g: 255, b: 255, a: 0.5 },
                test3 = { r: 127, g: 106, b: 137, a: 0.79 };
            
            let result1 = Colors.GetRGBAString(test1);
            let result2 = Colors.GetRGBAString(test2);
            let result3 = Colors.GetRGBAString(test3);

            expect(result1).to.equal(`rgba(${test1.r},${test1.g},${test1.b},${test1.a})`);
            expect(result2).to.equal(`rgba(${test2.r},${test2.g},${test2.b},${test2.a})`);
            expect(result3).to.equal(`rgba(${test3.r},${test3.g},${test3.b},${test3.a})`);
        });
    });

    /**
     * GetRandomColor() Test Cases
     */
    describe("GetRandomColor()", function () {
        it("should return a valid enum value for color", function () {
            let result1 = Colors.GetRandomColor();
            let result2 = Colors.GetRandomColor();
            let result3 = Colors.GetRandomColor();
            let result4 = Colors.GetRandomColor();
            let result5 = Colors.GetRandomColor();
            let result6 = Colors.GetRandomColor();

            expect(result1).to.be.within(0, ColorsAvailable - 1);
            expect(result2).to.be.within(0, ColorsAvailable - 1);
            expect(result3).to.be.within(0, ColorsAvailable - 1);
            expect(result4).to.be.within(0, ColorsAvailable - 1);
            expect(result5).to.be.within(0, ColorsAvailable - 1);
            expect(result6).to.be.within(0, ColorsAvailable - 1);
        });
    });
});

/**
 * DisplayFeature Unit Tests
 */
describe("DisplayFeature", function () {
    // Test data
    let mockDisplayFeature1,
        mockDisplayFeature2,
        mockDisplayFeatureWithSameId1,
        mockDisplayFeatureWithSameId2,
        mockDisplayFeatureWithSameId3;
    
    /**
     * Set up before each test case
     */
    beforeEach(function () {
        mockDisplayFeature1 = MockDisplayFeature.make("DisplayFeature1");
        mockDisplayFeature2 = MockDisplayFeature.make("DisplayFeature2");
        mockDisplayFeatureWithSameId1 = MockDisplayFeature.make("DisplayFeatureSameId");
        mockDisplayFeatureWithSameId2 = MockDisplayFeature.make("DisplayFeatureSameId");
        mockDisplayFeatureWithSameId3 = MockDisplayFeature.make("DisplayFeatureSameId");
    });

    /**
     * add() Test Cases
     */
    describe("add()", function () {
        it("should be able to add a display feature to itself", function () {
            mockDisplayFeature1.add(mockDisplayFeature2);

            let features = mockDisplayFeature1.getFeatures();
            expect(features).to.not.equal(null);
            expect(features).to.have.length(1);
            expect(features[0]).to.deep.equal(mockDisplayFeature2);
            expect(features[0].getParent()).to.deep.equal(mockDisplayFeature1);
        });
    });

    /**
     * cascade() Test Cases
     */
    describe("cascade()", function () {
        it("should cascade on specified ids in tree from root", function () {
            let displayId = mockDisplayFeatureWithSameId1.id,
                occurrences = 0,
                expectedOccurrences = 3,
                operation = function (displayFeature: DisplayFeature): void {
                    if (displayFeature.id === displayId) {
                        occurrences++;
                    }
                };
            
            // Create a tree of features with 1 as root
            mockDisplayFeature1.add(mockDisplayFeatureWithSameId1)
            mockDisplayFeature1.add(mockDisplayFeature2);
            mockDisplayFeature2.add(mockDisplayFeatureWithSameId2);
            mockDisplayFeatureWithSameId2.add(mockDisplayFeatureWithSameId3);

            // Cascade on 1
            mockDisplayFeature1.cascade(displayId, operation);

            expect(occurrences).to.equal(expectedOccurrences);
        });
    });
    
    /**
     * clearCascade() Test Cases
     */
    describe("clearCascade()", function () {
        it("should cascade on specified ids in tree from root", function () {
            let displayId = mockDisplayFeatureWithSameId1.id,
                occurrences = 0,
                expectedOccurrences = 3,
                mockClear = function (): void {
                    occurrences++;
                };
            
            // Set mock clear
            mockDisplayFeature1.clear = mockClear;
            mockDisplayFeature2.clear = mockClear;
            mockDisplayFeatureWithSameId1.clear = mockClear;
            mockDisplayFeatureWithSameId2.clear = mockClear;
            mockDisplayFeatureWithSameId3.clear = mockClear;
            
            // Create a tree of features with 1 as root
            mockDisplayFeature1.add(mockDisplayFeatureWithSameId1)
            mockDisplayFeature1.add(mockDisplayFeature2);
            mockDisplayFeature2.add(mockDisplayFeatureWithSameId2);
            mockDisplayFeatureWithSameId2.add(mockDisplayFeatureWithSameId3);

            // Cascade on 1
            mockDisplayFeature1.clearCascade(displayId);

            expect(occurrences).to.equal(expectedOccurrences);
        });
    });

    /**
     * fillCascade() Test Cases
     */
    describe("fillCascade()", function () {
        it("should cascade on specified ids in tree from root", function () {
            let displayId = mockDisplayFeatureWithSameId1.id,
                occurrences = 0,
                expectedOccurrences = 3,
                mockFill = function (): void {
                    occurrences++;
                };
            
            // Set mock fill
            mockDisplayFeature1.fill = mockFill;
            mockDisplayFeature2.fill = mockFill;
            mockDisplayFeatureWithSameId1.fill = mockFill;
            mockDisplayFeatureWithSameId2.fill = mockFill;
            mockDisplayFeatureWithSameId3.fill = mockFill;
            
            // Create a tree of features with 1 as root
            mockDisplayFeature1.add(mockDisplayFeatureWithSameId1)
            mockDisplayFeature1.add(mockDisplayFeature2);
            mockDisplayFeature2.add(mockDisplayFeatureWithSameId2);
            mockDisplayFeatureWithSameId2.add(mockDisplayFeatureWithSameId3);

            // Cascade on 1
            mockDisplayFeature1.fillCascade(displayId);

            expect(occurrences).to.equal(expectedOccurrences);
        });
    });

    /**
     * getRootDisplayFeature() Test Cases
     */
    describe("getRootDisplayFeature()", function () {
        it("should return the root display feature", function () {
            // Create a tree of features with 1 as root
            mockDisplayFeature1.add(mockDisplayFeatureWithSameId1)
            mockDisplayFeature1.add(mockDisplayFeature2);
            mockDisplayFeature2.add(mockDisplayFeatureWithSameId2);
            mockDisplayFeatureWithSameId2.add(mockDisplayFeatureWithSameId3);

            let result1 = mockDisplayFeature1.getRootDisplayFeature();
            let result2 = mockDisplayFeature2.getRootDisplayFeature();
            let result3 = mockDisplayFeatureWithSameId1.getRootDisplayFeature();
            let result4 = mockDisplayFeatureWithSameId2.getRootDisplayFeature();
            let result5 = mockDisplayFeatureWithSameId3.getRootDisplayFeature();

            expect(result1).to.not.equal(null);
            expect(result1.id).to.equal(mockDisplayFeature1.id);
            expect(result2).to.not.equal(null);
            expect(result2.id).to.equal(mockDisplayFeature1.id);
            expect(result3).to.not.equal(null);
            expect(result3.id).to.equal(mockDisplayFeature1.id);
            expect(result4).to.not.equal(null);
            expect(result4.id).to.equal(mockDisplayFeature1.id);
            expect(result5).to.not.equal(null);
            expect(result5.id).to.equal(mockDisplayFeature1.id);
        });
    });

    /**
     * hide() Test Cases
     */
    describe("hide()", function () {
        it("should hide all sub-trees", function () {
            let occurrences = 0,
                expectedOccurrences = 4,
                mockHide = function (): void {
                    occurrences++;
                };
            
            // Set mock hide for all but 1
            let mockDisplayFeature2OldHide = mockDisplayFeature2.hide.bind(mockDisplayFeature2);
            mockDisplayFeature2.hide = function () {
                mockHide();
                mockDisplayFeature2OldHide();
            };
            let mockDisplayFeatureWithSameId1OldHide = mockDisplayFeatureWithSameId1.hide.bind(mockDisplayFeatureWithSameId1);
            mockDisplayFeatureWithSameId1.hide = function () {
                mockHide();
                mockDisplayFeatureWithSameId1OldHide();
            };
            let mockDisplayFeatureWithSameId2OldHide = mockDisplayFeatureWithSameId2.hide.bind(mockDisplayFeatureWithSameId2);
            mockDisplayFeatureWithSameId2.hide = function () {
                mockHide();
                mockDisplayFeatureWithSameId2OldHide();
            };
            mockDisplayFeatureWithSameId3.hide = mockHide;
            
            // Create a tree of features with 1 as root
            mockDisplayFeature1.add(mockDisplayFeatureWithSameId1)
            mockDisplayFeature1.add(mockDisplayFeature2);
            mockDisplayFeature2.add(mockDisplayFeatureWithSameId2);
            mockDisplayFeatureWithSameId2.add(mockDisplayFeatureWithSameId3);

            mockDisplayFeature1.hide();

            expect(occurrences).to.equal(expectedOccurrences);
        });
    });

    /**
     * hideCascade() Test Cases
     */
    describe("hideCascade()", function () {
        it("should cascade on specified ids in tree from root", function () {
            let displayId = mockDisplayFeatureWithSameId1.id,
                occurrences = 0,
                expectedOccurrences = 3,
                mockHide = function (): void {
                    occurrences++;
                };
            
            // Set mock hide
            mockDisplayFeature1.hide = mockHide;
            mockDisplayFeature2.hide = mockHide;
            mockDisplayFeatureWithSameId1.hide = mockHide;
            mockDisplayFeatureWithSameId2.hide = mockHide;
            mockDisplayFeatureWithSameId3.hide = mockHide;
            
            // Create a tree of features with 1 as root
            mockDisplayFeature1.add(mockDisplayFeatureWithSameId1)
            mockDisplayFeature1.add(mockDisplayFeature2);
            mockDisplayFeature2.add(mockDisplayFeatureWithSameId2);
            mockDisplayFeatureWithSameId2.add(mockDisplayFeatureWithSameId3);

            // Cascade on 1
            mockDisplayFeature1.hideCascade(displayId);

            expect(occurrences).to.equal(expectedOccurrences);
        });
    });

    /**
     * remove() Test Cases
     */
    describe("remove()", function () {
        it("should remove display ids if they exist", function () {
            mockDisplayFeature1.add(mockDisplayFeature2);
            mockDisplayFeature2.add(mockDisplayFeature1);
            mockDisplayFeature2.add(mockDisplayFeatureWithSameId2);
            mockDisplayFeature2.add(mockDisplayFeatureWithSameId3);

            mockDisplayFeature1.remove(mockDisplayFeature2.id);
            mockDisplayFeature1.remove(mockDisplayFeatureWithSameId1.id);

            mockDisplayFeature2.remove(mockDisplayFeatureWithSameId2.id);
            mockDisplayFeature2.remove(mockDisplayFeature2.id);

            let result1 = mockDisplayFeature1.getFeatures();
            let result2 = mockDisplayFeature2.getFeatures();

            expect(result1).to.not.equal(null);
            expect(result1).to.have.length(0);

            expect(result2).to.not.equal(null);
            expect(result2).to.have.length(1);
            let result2Ids = result2.map((displayFeature: DisplayFeature) => displayFeature.id);
            expect(result2Ids).to.contain(mockDisplayFeature1.id);
            expect(result2Ids).to.not.contain(mockDisplayFeatureWithSameId2.id);
        });
    });

    /**
     * getParent() Test Cases
     */
    describe("getParent()", function () {
        it("should get parent set", function () {
            mockDisplayFeature2.setParent(mockDisplayFeature1);
            mockDisplayFeatureWithSameId2.setParent(mockDisplayFeature1);
            mockDisplayFeatureWithSameId3.setParent(mockDisplayFeatureWithSameId2);

            let result1 = mockDisplayFeature2.getParent();
            let result2 = mockDisplayFeatureWithSameId2.getParent();
            let result3 = mockDisplayFeatureWithSameId3.getParent();
            let result4 = mockDisplayFeature1.getParent();

            expect(result1).to.not.equal(null);
            expect(result1.id).to.equal(mockDisplayFeature1.id);
            expect(result2).to.not.equal(null);
            expect(result2.id).to.equal(mockDisplayFeature1.id);
            expect(result3).to.not.equal(null);
            expect(result3.id).to.equal(mockDisplayFeatureWithSameId2.id);
            expect(result4).to.equal(null);
        });
    });

    /**
     * setParent() Test Cases
     */
    describe("setParent()", function () {
        it("should set parent", function () {
            mockDisplayFeature2.setParent(mockDisplayFeature1);
            mockDisplayFeatureWithSameId2.setParent(mockDisplayFeature1);
            mockDisplayFeatureWithSameId3.setParent(mockDisplayFeatureWithSameId2);

            let result1 = mockDisplayFeature2.getParent();
            let result2 = mockDisplayFeatureWithSameId2.getParent();
            let result3 = mockDisplayFeatureWithSameId3.getParent();

            expect(result1).to.not.equal(null);
            expect(result1.id).to.equal(mockDisplayFeature1.id);
            expect(result2).to.not.equal(null);
            expect(result2.id).to.equal(mockDisplayFeature1.id);
            expect(result3).to.not.equal(null);
            expect(result3.id).to.equal(mockDisplayFeatureWithSameId2.id);
        });
    });

    /**
     * show() Test Cases
     */
    describe("show()", function () {
        it("should show all sub-trees", function () {
            let occurrences = 0,
                expectedOccurrences = 4,
                mockShow = function (): void {
                    occurrences++;
                };
            
            // Set mock show for all but 1
            let mockDisplayFeature2OldShow = mockDisplayFeature2.show.bind(mockDisplayFeature2);
            mockDisplayFeature2.show = function () {
                mockShow();
                mockDisplayFeature2OldShow();
            };
            let mockDisplayFeatureWithSameId1OldShow = mockDisplayFeatureWithSameId1.show.bind(mockDisplayFeatureWithSameId1);
            mockDisplayFeatureWithSameId1.show = function () {
                mockShow();
                mockDisplayFeatureWithSameId1OldShow();
            };
            let mockDisplayFeatureWithSameId2OldShow = mockDisplayFeatureWithSameId2.show.bind(mockDisplayFeatureWithSameId2);
            mockDisplayFeatureWithSameId2.show = function () {
                mockShow();
                mockDisplayFeatureWithSameId2OldShow();
            };
            mockDisplayFeatureWithSameId3.show = mockShow;
            
            // Create a tree of features with 1 as root
            mockDisplayFeature1.add(mockDisplayFeatureWithSameId1)
            mockDisplayFeature1.add(mockDisplayFeature2);
            mockDisplayFeature2.add(mockDisplayFeatureWithSameId2);
            mockDisplayFeatureWithSameId2.add(mockDisplayFeatureWithSameId3);

            mockDisplayFeature1.show();

            expect(occurrences).to.equal(expectedOccurrences);
        });
    });

    /**
     * showCascade() Test Cases
     */
    describe("showCascade()", function () {
        it("should cascade on specified ids in tree from root", function () {
            let displayId = mockDisplayFeatureWithSameId1.id,
                occurrences = 0,
                expectedOccurrences = 3,
                mockShow = function (): void {
                    occurrences++;
                };
            
            // Set mock show
            mockDisplayFeature1.show = mockShow;
            mockDisplayFeature2.show = mockShow;
            mockDisplayFeatureWithSameId1.show = mockShow;
            mockDisplayFeatureWithSameId2.show = mockShow;
            mockDisplayFeatureWithSameId3.show = mockShow;
            
            // Create a tree of features with 1 as root
            mockDisplayFeature1.add(mockDisplayFeatureWithSameId1)
            mockDisplayFeature1.add(mockDisplayFeature2);
            mockDisplayFeature2.add(mockDisplayFeatureWithSameId2);
            mockDisplayFeatureWithSameId2.add(mockDisplayFeatureWithSameId3);

            // Cascade on 1
            mockDisplayFeature1.showCascade(displayId);

            expect(occurrences).to.equal(expectedOccurrences);
        });
    });

    /**
     * getFeatures() Test Cases
     */
    describe("getFeatures()", function () {
        it("should get sub-features/children features", function () {
            // Create a tree of features with 1 as root
            mockDisplayFeature1.add(mockDisplayFeatureWithSameId1)
            mockDisplayFeature1.add(mockDisplayFeature2);
            mockDisplayFeature2.add(mockDisplayFeatureWithSameId2);
            mockDisplayFeatureWithSameId2.add(mockDisplayFeatureWithSameId3);

            let result1 = mockDisplayFeature1.getFeatures();
            let result2 = mockDisplayFeature2.getFeatures();
            let result3 = mockDisplayFeatureWithSameId1.getFeatures();
            let result4 = mockDisplayFeatureWithSameId2.getFeatures();
            let result5 = mockDisplayFeatureWithSameId3.getFeatures();

            expect(result1).to.not.equal(null);
            expect(result1).to.have.length(2);
            let result1Ids = result1.map((displayFeature: DisplayFeature) => displayFeature.id);
            expect(result1Ids).to.contain(mockDisplayFeature2.id);
            expect(result1Ids).to.contain(mockDisplayFeatureWithSameId1.id);

            expect(result2).to.not.equal(null);
            expect(result2).to.have.length(1);
            let result2Ids = result2.map((displayFeature: DisplayFeature) => displayFeature.id);
            expect(result2Ids).to.contain(mockDisplayFeatureWithSameId2.id);

            expect(result3).to.not.equal(null);
            expect(result3).to.have.length(0);

            expect(result4).to.not.equal(null);
            expect(result4).to.have.length(1);
            let result4Ids = result4.map((displayFeature: DisplayFeature) => displayFeature.id);
            expect(result4Ids).to.contain(mockDisplayFeatureWithSameId3.id);

            expect(result5).to.not.equal(null);
            expect(result5).to.have.length(0);
        });
    });
});
