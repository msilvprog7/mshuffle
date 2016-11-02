import {Authorization, Identifiable, User} from "../../shared/auth";

import {MockAuthorization, MockClientCredentials, MockUser} from "../mock/auth";

import {MockSong} from "../mock/music";

import chai = require("chai");


let expect = chai.expect;

/**
 * Authorization Unit Tests
 */
describe("Authorization", function () {
    // Test data
    let validClientCredentials = MockClientCredentials.make(
            "MyClientId",
            "MyClientSecret",
            "MyRedirectUri",
            ["Scope 1", "Scope 2", "Scope 3"]),
        invalidClientCredentials1 = MockClientCredentials.make(
            null,
            "MyClientSecret",
            "MyRedirectUri",
            ["Scope 1", "Scope 2"]),
        invalidClientCredentials2 = MockClientCredentials.make(
            "MyClientId",
            null,
            "MyRedirectUri",
            ["Scope 1"]),
        validAuthorization = MockAuthorization.make(
            "MyAccessToken",
            "MyRefreshToken"),
        invalidAuthorization = MockAuthorization.make(
            null,
            "MyRefreshToken");
    
    /**
     * GetAuthBasicHeader() Test Cases
     */
    describe("GetAuthBasicHeader()", function () {
        it("should produce a basic header for client credentials", function () {
            let expectedHeaderValue = `${validClientCredentials.clientId}:${validClientCredentials.clientSecret}`;

            let requestHeaders = Authorization.GetAuthBasicHeader(validClientCredentials);

            expect(requestHeaders).to.not.equal(null);
            expect(requestHeaders).to.have.property("Authorization");
            expect(requestHeaders["Authorization"]).to.not.equal(null);
            
            let headerComponents = requestHeaders["Authorization"].split(/\s+/g);
            expect(headerComponents).to.have.length(2);
            expect(headerComponents[0]).to.equal("Basic");
            expect(Buffer.from(headerComponents[1], "base64").toString()).to.equal(expectedHeaderValue);
        });

        it("should produce a null value for missing credential values", function () {
            let expectedHeaderValue1 = null,
                expectedHeaderValue2 = null;

            let requestHeaders1 = Authorization.GetAuthBasicHeader(invalidClientCredentials1);
            let requestHeaders2 = Authorization.GetAuthBasicHeader(invalidClientCredentials2);

            expect(requestHeaders1).to.not.equal(null);
            expect(requestHeaders1).to.have.property("Authorization");
            expect(requestHeaders1["Authorization"]).to.equal(expectedHeaderValue1);

            expect(requestHeaders2).to.not.equal(null);
            expect(requestHeaders2).to.have.property("Authorization");
            expect(requestHeaders2["Authorization"]).to.equal(expectedHeaderValue2);
        });
    });

    /**
     * GetAuthBearerHeader() Test Cases
     */
    describe("GetAuthBearerHeader()", function () {
        it("should produce a bearer header for authorization", function () {
            let expectedHeaderValue = `Bearer ${validAuthorization.accessToken}`;

            let requestHeaders = Authorization.GetAuthBearerHeader(validAuthorization);

            expect(requestHeaders).to.not.equal(null);
            expect(requestHeaders).to.have.property("Authorization");
            expect(requestHeaders["Authorization"]).to.not.equal(null);
            expect(requestHeaders["Authorization"]).to.equal(expectedHeaderValue);
        });

        it("should produce a null value for missing authorization values", function () {
            let expectedHeaderValue1 = null;

            let requestHeaders1 = Authorization.GetAuthBearerHeader(invalidAuthorization);

            expect(requestHeaders1).to.not.equal(null);
            expect(requestHeaders1).to.have.property("Authorization");
            expect(requestHeaders1["Authorization"]).to.equal(expectedHeaderValue1);
        });
    });

    /**
     * Hash() Test Cases
     */
    describe("Hash()", function () {
        it("should return a consistent hash for valid authorization", function () {
            let hash1 = Authorization.Hash(validAuthorization);
            let hash2 = Authorization.Hash(validAuthorization);
            let hash3 = Authorization.Hash(validAuthorization);

            expect(hash1).to.not.equal(null);
            expect(hash1.length).to.not.equal(0);
            expect(hash2).to.not.equal(null);
            expect(hash2.length).to.not.equal(0);
            expect(hash3).to.not.equal(null);
            expect(hash3.length).to.not.equal(0);

            expect(hash1).to.equal(hash2);
            expect(hash2).to.equal(hash3);
        });

        it("should return null for missing authorization access token", function () {
            let hash1 = Authorization.Hash(invalidAuthorization);

            expect(hash1).to.equal(null);
        });
    });

    /**
     * IsAuthorization() Test Cases
     */
    describe("IsAuthorization()", function () {
        it("should return true for valid authorizations", function () {
            let result1 = Authorization.IsAuthorization(validAuthorization);
            let result2 = Authorization.IsAuthorization(invalidAuthorization);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
        });

        it("should return false for non-authorization values", function () {
            let bool = true,
                num = 27.56,
                notAuth = { accessToken: "blah", refreshToken: 12 };
            
            let result1 = Authorization.IsAuthorization(bool);
            let result2 = Authorization.IsAuthorization(num);
            let result3 = Authorization.IsAuthorization(notAuth);
            
            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
        });
    });

    /**
     * make() Test Cases
     */
    describe("make()", function () {
        it("should return an Authorization", function () {
            let result1 = Authorization.make(validAuthorization.accessToken, validAuthorization.refreshToken);
            let result2 = Authorization.make(invalidAuthorization.accessToken, invalidAuthorization.refreshToken);
            let result3 = Authorization.make("12345", "67890");

            expect(result1).to.deep.equal(validAuthorization);
            expect(result2).to.deep.equal(invalidAuthorization);
            expect(result3).to.deep.equal({ accessToken: "12345", refreshToken: "67890" });
        });
    });
});

/**
 * Identifiable Unit Tests
 */
describe("Identifiable", function () {
    /**
     * AreIds() Test Cases
     */
    describe("AreIds()", function () {
        it("should return true for empty lists and lists of ids", function () {
            let ids1 = [],
                ids2 = ["1"],
                ids3 = ["1", "2", "3"];
            
            let result1 = Identifiable.AreIds(ids1);
            let result2 = Identifiable.AreIds(ids2);
            let result3 = Identifiable.AreIds(ids3);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
        });

        it("should return false for non-lists and lists of other stuff", function () {
            let notIds1 = false,
                notIds2 = 27.6,
                notIds3 = "hello",
                notIds4 = ["a", "b", 14.5];
            
            let result1 = Identifiable.AreIds(notIds1);
            let result2 = Identifiable.AreIds(notIds2);
            let result3 = Identifiable.AreIds(notIds3);
            let result4 = Identifiable.AreIds(notIds4);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
            expect(result4).to.equal(false);
        });
    });

    /**
     * IsId() Test Cases
     */
    describe("IsId()", function () {
        it("should return true for ids", function () {
            let id1 = "",
                id2 = "1",
                id3 = "12345";
            
            let result1 = Identifiable.IsId(id1);
            let result2 = Identifiable.IsId(id2);
            let result3 = Identifiable.IsId(id3);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
        });

        it("should return false for non-ids", function () {
            let notId1 = false,
                notId2 = 27.6,
                notId3 = ["a", "b", 14.5],
                notId4 = { "a": 1, "b": 2 };
            
            let result1 = Identifiable.IsId(notId1);
            let result2 = Identifiable.IsId(notId2);
            let result3 = Identifiable.IsId(notId3);
            let result4 = Identifiable.IsId(notId4);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
            expect(result4).to.equal(false);
        });
    });

    /**
     * IsIdentifiable() Test Cases
     */
    describe("IsIdentifiable()", function () {
        it("should return true for identifiables", function () {
            let id1 = { "a": 1, "b": true, "id": ""},
                id2 = { "a": false, "b": "yo", "id": "09876"},
                id3 = { id: "12345" },
                id4 = MockSong.makeSingleAlbumSingleArtist(12345);
            
            let result1 = Identifiable.IsIdentifiable(id1);
            let result2 = Identifiable.IsIdentifiable(id2);
            let result3 = Identifiable.IsIdentifiable(id3);
            let result4 = Identifiable.IsIdentifiable(id4);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
            expect(result4).to.equal(true);
        });

        it("should return false for non-identifiables", function () {
            let notId1 = false,
                notId2 = 27.6,
                notId3 = ["a", "b", 14.5],
                notId4 = { "a": 1, "b": 2 };
            
            let result1 = Identifiable.IsIdentifiable(notId1);
            let result2 = Identifiable.IsIdentifiable(notId2);
            let result3 = Identifiable.IsIdentifiable(notId3);
            let result4 = Identifiable.IsIdentifiable(notId4);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
            expect(result4).to.equal(false);
        });
    });
});

/**
 * User Unit Tests
 */
describe("User", function () {
    /**
     * IsUser() Test Cases
     */
    describe("IsUser()", function () {
        it("should return true for a user", function () {
            let user1 = MockUser.make("First Last"),
                user2 = MockUser.make("First"),
                user3 = MockUser.make("");
            
            let result1 = User.IsUser(user1);
            let result2 = User.IsUser(user2);
            let result3 = User.IsUser(user3);

            expect(result1).to.equal(true);
            expect(result2).to.equal(true);
            expect(result3).to.equal(true);
        });

        it("should return false for non-users", function () {
            let notUser1 = false,
                notUser2 = 26.7,
                notUser3 = [1, 2, 3],
                notUser4 = { "a": true, "b": 25 };

            let result1 = User.IsUser(notUser1);
            let result2 = User.IsUser(notUser2);
            let result3 = User.IsUser(notUser3);
            let result4 = User.IsUser(notUser4);

            expect(result1).to.equal(false);
            expect(result2).to.equal(false);
            expect(result3).to.equal(false);
            expect(result4).to.equal(false);
        });
    });
});
