import RequestAPI from "../../../lib/http/RequestAPI";
import {RequestError, RequestOptions, RequestSuccess, RequestType} from "../../../shared/http";

import chai = require("chai");


let expect = chai.expect;
let sinon = require("sinon");

let request = require("request");

/**
 * RequestAPI Unit Tests
 */
describe("RequestAPI", function () {
    // Test data
    let requestApi: RequestAPI,
        result = { one: "2", 3: "four" },
        result2 = { 2: "three", one: "4" },
        result3 = [4, 8, 15, 16, 23, 42],
        result4 = { };

    // Stubs
    let requestGetStub, requestPostStub, requestPutStub, requestDelStub;

    /**
     * Initialize tests
     */
    before(function () {
        // Setup request stubs
        requestGetStub = sinon.stub(request, "get");
        requestPostStub = sinon.stub(request, "post");
        requestPutStub = sinon.stub(request, "put");
        requestDelStub = sinon.stub(request, "del");
    });

    /**
     * Set up before each test
     */
    beforeEach(function () {
        requestApi = new RequestAPI();
    });

    /**
     * Cleanup after tests
     */
    after(function () {
        request.get.restore();
        request.post.restore();
        request.put.restore();
        request.del.restore();
    })

    /**
     * send() Test Cases
     */
    describe("send()", function () {
        it("should be able to send a successful get request", function (done) {
            let requestOptions: RequestOptions = {
                    url: "http://github.com/",
                    type: RequestType.GET
                },
                success: RequestSuccess = RequestSuccess.make(function (data?: any) {
                    expect(data).to.deep.equal(result);
                    done();
                }),
                error: RequestError = RequestError.make(function (statusCode: number, errorMessage: string) {
                    done(errorMessage);
                });

            requestGetStub.yields(null, { statusCode: 200 }, result);
            requestPostStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestPutStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestDelStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });

            requestApi.send(requestOptions, success, error);
        });

        it("should be able to send a bad get request", function (done) {
            let requestOptions: RequestOptions = {
                    url: "http://github.com/",
                    type: RequestType.GET
                },
                expectedStatus = 400,
                expectedMessage = "This is a Spooky request",
                success: RequestSuccess = RequestSuccess.make(function (data?: any) {
                    done({ error: true });
                }),
                error: RequestError = RequestError.make(function (statusCode: number, errorMessage: string) {
                    expect(statusCode).to.equal(expectedStatus);
                    expect(errorMessage).to.equal(expectedMessage);
                    done();
                });
            
            requestGetStub.yields(null, { statusCode: expectedStatus, statusMessage: expectedMessage }, null);
            requestPostStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestPutStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestDelStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });

            requestApi.send(requestOptions, success, error);
        });

        it("should be able to send a successful post request", function (done) {
            let requestOptions: RequestOptions = {
                    url: "http://github.com/",
                    type: RequestType.POST,
                    headers: { "fake": "headers", "too": "!" },
                    data: { fake: false, data: 26614 }
                },
                success: RequestSuccess = RequestSuccess.make(function (data?: any) {
                    expect(data).to.deep.equal(result2);
                    done();
                }),
                error: RequestError = RequestError.make(function (statusCode: number, errorMessage: string) {
                    done(errorMessage);
                });
            
            requestPostStub.yields(null, { statusCode: 200 }, result2);
            requestGetStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestPutStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestDelStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });

            requestApi.send(requestOptions, success, error);
        });

        it("should be able to send a bad post request", function (done) {
            let requestOptions: RequestOptions = {
                    url: "http://github.com/",
                    type: RequestType.POST,
                    headers: { "fake": "headers", "too": "!" },
                    data: { fake: false, data: 26614 }
                },
                expectedStatus = 403,
                expectedMessage = "BANISHED",
                success: RequestSuccess = RequestSuccess.make(function (data?: any) {
                    done({ error: true });
                }),
                error: RequestError = RequestError.make(function (statusCode: number, errorMessage: string) {
                    expect(statusCode).to.equal(expectedStatus);
                    expect(errorMessage).to.equal(expectedMessage);
                    done();
                });
            
            requestPostStub.yields(null, { statusCode: expectedStatus, statusMessage: expectedMessage }, null);
            requestGetStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestPutStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestDelStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });

            requestApi.send(requestOptions, success, error);
        });

        it("should be able to send a successful put request", function (done) {
            let requestOptions: RequestOptions = {
                    url: "http://github.com/",
                    type: RequestType.PUT,
                    data: { fake: true, data: 1337 }
                },
                success: RequestSuccess = RequestSuccess.make(function (data?: any) {
                    expect(data).to.deep.equal(result3);
                    done();
                }),
                error: RequestError = RequestError.make(function (statusCode: number, errorMessage: string) {
                    done(errorMessage);
                });
            
            requestPutStub.yields(null, { statusCode: 200 }, result3);
            requestGetStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestPostStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestDelStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });

            requestApi.send(requestOptions, success, error);
        });

        it("should be able to send a bad put request", function (done) {
            let requestOptions: RequestOptions = {
                    url: "http://github.com/",
                    type: RequestType.PUT,
                    data: { fake: true, data: 1337 }
                },
                expectedStatus: 501, 
                expectedMessage: "Badput",
                success: RequestSuccess = RequestSuccess.make(function (data?: any) {
                    done({ error: true });
                }),
                error: RequestError = RequestError.make(function (statusCode: number, errorMessage: string) {
                    expect(statusCode).to.equal(expectedStatus);
                    expect(errorMessage).to.equal(expectedMessage);
                    done();
                });
            
            requestPutStub.yields({ status: expectedStatus, message: expectedMessage }, { }, null);
            requestGetStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestPostStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestDelStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });

            requestApi.send(requestOptions, success, error);
        });

        it("should be able to send a successful delete request", function (done) {
            let requestOptions: RequestOptions = {
                    url: "http://github.com/",
                    type: RequestType.DELETE
                },
                success: RequestSuccess = RequestSuccess.make(function (data?: any) {
                    expect(data).to.deep.equal(result4);
                    done();
                }),
                error: RequestError = RequestError.make(function (statusCode: number, errorMessage: string) {
                    done(errorMessage);
                });
            
            requestDelStub.yields(null, { statusCode: 200 }, result4);
            requestGetStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestPostStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestPutStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });

            requestApi.send(requestOptions, success, error);
        });

        it("should be able to send a bad delete request", function (done) {
            let requestOptions: RequestOptions = {
                    url: "http://github.com/",
                    type: RequestType.DELETE
                },
                expectedStatus = 417,
                expectedMessage = "Look it up for the irony",
                success: RequestSuccess = RequestSuccess.make(function (data?: any) {
                    done({ error: true });
                }),
                error: RequestError = RequestError.make(function (statusCode: number, errorMessage: string) {
                    expect(statusCode).to.equal(expectedStatus);
                    expect(errorMessage).to.equal(expectedMessage);
                    done();
                });
            
            requestDelStub.yields(null, { statusCode: 200 }, { error: { status: expectedStatus, message: expectedMessage }});
            requestGetStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestPostStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestPutStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });

            requestApi.send(requestOptions, success, error);
        });
    }),

    /**
     * get() Test Cases
     */
    describe("get()", function () {
        it("should be able to send a successful request", function (done) {
            let requestOptions: RequestOptions = {
                    url: "https://github.com/",
                    type: RequestType.GET
                },
                success: RequestSuccess = RequestSuccess.make(function (data?: any) {
                    expect(data).to.deep.equal(result2);
                    done();
                }),
                error: RequestError = RequestError.make(function (statusCode: number, errorMessage: string) {
                    done(errorMessage);
                });
            
            requestGetStub.yields(null, { statusCode: 200 }, result2);
            requestPostStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestPutStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestDelStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });

            requestApi.get(requestOptions, success, error);
        });

        it("should be able to send a bad request", function (done) {
            let requestOptions: RequestOptions = {
                    url: "https://github.com/",
                    type: RequestType.GET
                },
                expectedStatus = 401,
                expectedMessage = "This is a repeat request",
                success: RequestSuccess = RequestSuccess.make(function (data?: any) {
                    done({ error: true });
                }),
                error: RequestError = RequestError.make(function (statusCode: number, errorMessage: string) {
                    expect(statusCode).to.equal(expectedStatus);
                    expect(errorMessage).to.equal(expectedMessage);
                    done();
                });
            
            requestGetStub.yields(null, { statusCode: expectedStatus, statusMessage: expectedMessage }, null);
            requestPostStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestPutStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestDelStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });

            requestApi.get(requestOptions, success, error);
        });
    });

    /**
     * post() Test Cases
     */
    describe("post()", function () {
        it("should be able to send a successful request", function (done) {
            let requestOptions: RequestOptions = {
                    url: "https://github.com/",
                    type: RequestType.POST,
                    headers: { "fake": "headers", "too": "!" },
                    data: { fake: false, data: 26614 }
                },
                success: RequestSuccess = RequestSuccess.make(function (data?: any) {
                    expect(data).to.deep.equal(result3);
                    done();
                }),
                error: RequestError = RequestError.make(function (statusCode: number, errorMessage: string) {
                    done(errorMessage);
                });
            
            requestPostStub.yields(null, { statusCode: 200 }, result3);
            requestGetStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestPutStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestDelStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });

            requestApi.post(requestOptions, success, error);
        });

        it("should be able to send a bad request", function (done) {
            let requestOptions: RequestOptions = {
                    url: "https://github.com/",
                    type: RequestType.POST,
                    headers: { "fake": "headers", "too": "!" },
                    data: { fake: false, data: 26614 }
                },
                expectedStatus = 403,
                expectedMessage = "BANISHED AGAIN",
                success: RequestSuccess = RequestSuccess.make(function (data?: any) {
                    done({ error: true });
                }),
                error: RequestError = RequestError.make(function (statusCode: number, errorMessage: string) {
                    expect(statusCode).to.equal(expectedStatus);
                    expect(errorMessage).to.equal(expectedMessage);
                    done();
                });
            
            requestPostStub.yields(null, { statusCode: expectedStatus, statusMessage: expectedMessage }, null);
            requestGetStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestPutStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestDelStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });

            requestApi.post(requestOptions, success, error);
        });
    });

    /**
     * put() Test Cases
     */
    describe("put()", function () {
        it("should be able to send a successful request", function (done) {
            let requestOptions: RequestOptions = {
                    url: "https://github.com/",
                    type: RequestType.PUT,
                    data: { fake: true, data: 1337 }
                },
                success: RequestSuccess = RequestSuccess.make(function (data?: any) {
                    expect(data).to.deep.equal(result);
                    done();
                }),
                error: RequestError = RequestError.make(function (statusCode: number, errorMessage: string) {
                    done(errorMessage);
                });
            
            requestPutStub.yields(null, { statusCode: 200 }, result);
            requestGetStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestPostStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestDelStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });

            requestApi.put(requestOptions, success, error);
        });

        it("should be able to send a bad request", function (done) {
            let requestOptions: RequestOptions = {
                    url: "https://github.com/",
                    type: RequestType.PUT,
                    data: { fake: true, data: 1337 }
                },
                expectedStatus: 503,
                expectedMessage: "Badput2",
                success: RequestSuccess = RequestSuccess.make(function (data?: any) {
                    done({ error: true });
                }),
                error: RequestError = RequestError.make(function (statusCode: number, errorMessage: string) {
                    expect(statusCode).to.equal(expectedStatus);
                    expect(errorMessage).to.equal(expectedMessage);
                    done();
                });
            
            requestPutStub.yields({ status: expectedStatus, message: expectedMessage }, { }, null);
            requestGetStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestPostStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestDelStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });

            requestApi.put(requestOptions, success, error);
        });
    });

    /**
     * delete() Test Cases
     */
    describe("delete()", function () {
        it("should be able to send a successful request", function (done) {
            let requestOptions: RequestOptions = {
                    url: "https://github.com/",
                    type: RequestType.DELETE
                },
                success: RequestSuccess = RequestSuccess.make(function (data?: any) {
                    expect(data).to.deep.equal(result2);
                    done();
                }),
                error: RequestError = RequestError.make(function (statusCode: number, errorMessage: string) {
                    done(errorMessage);
                });
            
            requestDelStub.yields(null, { statusCode: 200 }, result2);
            requestGetStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestPostStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestPutStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });

            requestApi.delete(requestOptions, success, error);
        });

        it("should be able to send a bad request", function (done) {
            let requestOptions: RequestOptions = {
                    url: "https://github.com/",
                    type: RequestType.DELETE
                },
                expectedStatus = 417,
                expectedMessage = "Look it up for the irony :P",
                success: RequestSuccess = RequestSuccess.make(function (data?: any) {
                    done({ error: true });
                }),
                error: RequestError = RequestError.make(function (statusCode: number, errorMessage: string) {
                    expect(statusCode).to.equal(expectedStatus);
                    expect(errorMessage).to.equal(expectedMessage);
                    done();
                });
            
            requestDelStub.yields(null, { statusCode: 200 }, { error: { status: expectedStatus, message: expectedMessage }});
            requestGetStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestPostStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });
            requestPutStub.yields(null, { statusCode: 500, statusMessage: "Not supposed to do this" }, { });

            requestApi.delete(requestOptions, success, error);
        });
    });
});
