/**
 * Authentication and Authorization type aliases and interfaces
 */

import {RequestHeaders, uri} from "./http";


/**
 * Crypto
 */
const crypto = require("crypto");

/**
 * Type alias for an Id
 */
export type Id = string;

/**
 * Type alias for an authorization scope
 */
export type Scope = string;

/**
 * Type alias for a Secret key
 */
export type Secret = string;

/**
 * Type alias for a token
 */
export type Token = string | null;

/**
 * Interface for API Authorization
 */
export interface Authorization {
    /**
     * User's access token
     */
    readonly accessToken: Token;

    /**
     * User's refresh token
     */
    readonly refreshToken: Token;
}

/**
 * Static methods for Authorization
 */
export class Authorization {
    /**
     * Get an auth basic header using client Credentials
     * @param creds Client Credentials for the API
     * @returns Request Headers
     */
    public static GetAuthBasicHeader(creds: ClientCredentials): RequestHeaders {
        let headers: RequestHeaders = {};

        if (creds.clientId != null && creds.clientSecret != null) {
            headers["Authorization"] = 'Basic ' + 
                            (new Buffer(`${creds.clientId}:${creds.clientSecret}`).toString('base64'));
        } else {
            headers["Authorization"] = null;
        }

        return headers;
    }
    
    /**
     * Get an auth bearer header
     * @param auth Authorization
     * @returns Request Headers
     */
    public static GetAuthBearerHeader(auth: Authorization): RequestHeaders {
        let headers: RequestHeaders = {};

        if (auth.accessToken != null) {
            headers["Authorization"] = `Bearer ${auth.accessToken}`;
        } else {
            headers["Authorization"] = null;
        }

        return headers;
    }

    /**
     * Hash authorization into an sha 512 hashed value
     * @param auth Auth to Encrypt
     * @returns Hashed value
     */
    public static Hash(auth: Authorization): string {
        if (auth.accessToken == null) {
            return null;
        }

        let hash = crypto.createHash("sha512");
        return hash.update(auth.accessToken).digest("base64");
    }

    /**
     * Authorization's type guard
     */
    public static IsAuthorization(auth: any): auth is Authorization {
        return (auth !== undefined &&
            auth !== null &&
            typeof(auth) === "object" &&
            "accessToken" in auth &&
            (auth.accessToken === null || typeof(auth.accessToken) === "string") &&
            "refreshToken" in auth &&
            (auth.refreshToken === null || typeof(auth.refreshToken) === "string"));
    }

    /**
     * Make an authorization object
     * @param accessToken Access Token
     * @param refreshToken Refresh Token
     * @returns Authorization
     */
    public static make(accessToken: Token, refreshToken: Token): Authorization {
        let auth: Authorization = {
            accessToken: accessToken,
            refreshToken: refreshToken
        };
        return auth;
    }
}

/**
 * Interface for Client Credentials for an API
 */
export interface ClientCredentials {
    /**
     * Client Id for API
     */
    readonly clientId: Id;

    /**
     * Client Secret for API
     */
    readonly clientSecret: Secret;

    /**
     * Redirect URI
     */
    readonly redirectUri: uri;

    /**
     * Scopes being accessed
     */
    readonly scopes: Scope[];
}

/**
 * Interface for anything Identifiable via an Id
 */
export interface Identifiable {
    /**
     * Identifier
     */
    readonly id: Id;
}

/**
 * Static methods for Identifiable things
 */
export class Identifiable {
    /**
     * Id[] type guard
     */
    public static AreIds(ids: any): ids is Id[] {
        if (!(ids instanceof Array)) {
            return false;
        }

        for (let id of ids) {
            if (!Identifiable.IsId(id)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Id type guard
     * @param id Potential id
     */
    public static IsId(id: any): id is Id {
        return (id !== undefined &&
            id !== null &&
            typeof(id) === "string");
    }

    /**
     * Identifiable type guard
     * @param identifiable Potential Identifiable
     */
    public static IsIdentifiable(identifiable: any): identifiable is Identifiable {
        return (identifiable !== undefined &&
            identifiable !== null &&
            typeof(identifiable) === "object" &&
            "id" in identifiable &&
            Identifiable.IsId(identifiable.id));
    }
}

/**
 * Interface for a User, including his or her information
 */
export interface User {
    /**
     * User's fullname
     */
    readonly fullname: string;
}

/**
 * Static methods for User
 */
export class User {
    /**
     * User type guard
     */
    public static IsUser(user: any): user is User {
        return (user !== undefined &&
            user !== null &&
            typeof(user) === "object" &&
            "fullname" in user &&
            typeof(user.fullname) === "string");
    }
}
