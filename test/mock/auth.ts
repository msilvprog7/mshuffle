/**
 * Mock data for auth related interfaces
 */

import {Authorization, ClientCredentials, Id, Scope, Secret, Token, User} from "../../shared/auth";

import {uri} from "../../shared/http";


/**
 * Authorization mocks
 */
export class MockAuthorization {
    /**
     * Make an authorization mock
     */
    public static make(accessToken: Token, refreshToken: Token): Authorization {
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        };
    }
}

/**
 * Client Credentials mocks
 */
export class MockClientCredentials {
    /**
     * Make a client credentials mock
     */
    public static make(clientId: Id, clientSecret: Secret, redirectUri: uri, scopes: Scope[]): ClientCredentials {
        return {
            clientId: clientId,
            clientSecret: clientSecret,
            redirectUri: redirectUri,
            scopes: scopes
        };
    }
}

/**
 * User mocks
 */
export class MockUser {
    /**
     * Make a user mock
     */
    public static make(fullname: string): User {
        return {
            fullname: fullname
        };
    }
}
