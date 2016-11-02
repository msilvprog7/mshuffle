import {RequestError, RequestSuccess} from "../../shared/http";

import chai = require("chai");


let expect = chai.expect;

/**
 * RequestError Unit Tests
 */
describe("RequestError", function () {
    /**
     * make() Test Cases
     */
    describe("make()", function () {
        it("should have special handling for status codes and messages", function () {
            let sumOfCodes = 0,
                expectedSum = 1509,
                codesAndMessages = [
                    { statusCode: 200, errorMessage: "OK" },
                    { statusCode: 400, errorMessage: "Bad Request" },
                    { statusCode: 409, errorMessage: "Conflict" },
                    { statusCode: 500, errorMessage: "Internal Server Error" }
                ],
                operation = function (statusCode: number, errorMessage: string) {
                    sumOfCodes += statusCode
                },
                requestError = RequestError.make(operation);
            
            codesAndMessages.forEach(codesAndMessages => requestError.error(codesAndMessages.statusCode, codesAndMessages.errorMessage));

            expect(sumOfCodes).to.equal(expectedSum);
        });
    });

    /**
     * makeUnauthorized() Test Cases
     */
    describe("makeUnauthorized()", function () {
        it("should have special functionality for 401s", function () {
            let occurred = 0,
                expectedOccurred = 1,
                operation = function () {
                    occurred++;
                },
                requestError = RequestError.makeUnauthorized(operation);
            
            requestError.error(401, "Unauthorized");

            expect(occurred).to.equal(expectedOccurred);
        });

        it("should not have special functionality for non-403s", function () {
            let occurred = 0,
                expectedOccurred = 0,
                operation = function () {
                    occurred++;
                },
                requestError = RequestError.makeUnauthorized(operation);
            
            requestError.error(400, "Bad Request");
            requestError.error(403, "Forbidden");
            requestError.error(500, "Internal Server Error");

            expect(occurred).to.equal(expectedOccurred);
        });
    });

    /**
     * makeForbidden() Test Cases
     */
    describe("makeForbidden()", function () {
        it("should have special functionality for 403s", function () {
            let occurred = 0,
                expectedOccurred = 1,
                operation = function () {
                    occurred++;
                },
                requestError = RequestError.makeForbidden(operation);
            
            requestError.error(403, "Forbidden");

            expect(occurred).to.equal(expectedOccurred);
        });

        it("should not have special functionality for non-403s", function () {
            let occurred = 0,
                expectedOccurred = 0,
                operation = function () {
                    occurred++;
                },
                requestError = RequestError.makeForbidden(operation);
            
            requestError.error(400, "Bad Request");
            requestError.error(401, "Unauthorized");
            requestError.error(500, "Internal Server Error");

            expect(occurred).to.equal(expectedOccurred);
        });
    });
});

/**
 * RequestSuccess Unit Tests
 */
describe("RequestSuccess", function () {
    /**
     * make() Test Cases
     */
    describe("make()", function () {
        it("should have a success function", function () {
            let occurred = 0,
                expectedOccurred = 1,
                operation = function (data?: any) {
                    occurred++;
                },
                requestSuccess = RequestSuccess.make(operation);
            
            requestSuccess.success();

            expect(occurred).to.equal(expectedOccurred);
        });
    });
});
