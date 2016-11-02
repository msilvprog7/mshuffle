/**
 * HTTP request type aliases, enums, and interfaces
 */

import {IdToValue, NameValue} from "./data";


/**
 * Type alias for a Request Header
 */
export type RequestHeader = NameValue<string>;

/**
 * Type alias for a URI
 */
export type uri = string;

/**
 * Enum for different request data types
 */
export enum RequestDataType {
    /**
     * JSON data
     */
    JSON
}

/**
 * Enum for different request types
 */
export enum RequestType {
    /**
     * Delete request
     */
    DELETE,

    /**
     * Get request
     */
    GET,

    /**
     * Post request
     */
    POST,

    /**
     * Put request
     */
    PUT
}

/**
 * Information for redirect
 */
export interface RedirectInfo {
    url: uri,
    cookies: IdToValue<string>
}

/**
 * Interface for an erroneous
 * request sent
 */
export interface RequestError {
    /**
     * Error function
     * @param statusCode Http Error Status Code
     * @param errorMessage Error Message
     */
    error(statusCode: number, errorMessage: string): void;
}

/**
 * Static functions for RequestError
 */
export class RequestError {
    /**
     * Make a generic 'Status: message' RequestError
     */
    public static generic(): RequestError {
        return RequestError.make(function (statusCode: number, errorMessage: string): void {
            console.error(`${statusCode}: ${errorMessage}`);
        });
    }
    
    /**
     * Make a RequestError
     * @param operation Error function
     * @returns RequestError
     */
    public static make(operation: (statusCode: number, errorMessage: string) => void): RequestError {
        return {
            error: operation
        };
    }

    /**
     * Make a RequestError with special Unauthorized
     * behavior
     * @param operation Error function
     * @returns RequestError
     */
    public static makeUnauthorized(operation: () => void): RequestError {
        return RequestError.make(function (statusCode: number, errorMessage: string): void {
            if (statusCode === 401) {
                operation();
            } else {
                console.error(`${statusCode}: ${errorMessage}`);
            }
        });
    }

    /**
     * Make a RequestError with special Forbidden
     * behavior
     * @param operation Error function
     * @returns RequestError
     */
    public static makeForbidden(operation: () => void): RequestError {
        return RequestError.make(function (statusCode: number, errorMessage: string): void {
            if (statusCode === 403) {
                operation();
            } else {
                console.error(`${statusCode}: ${errorMessage}`);
            }
        });
    }
}

/**
 * Interface for Request Headers passed
 * in a request
 */
export interface RequestHeaders {
    /**
     * Indexer from header name to value
     */
    [index: string]: string;
}

/**
 * Interface for Request Options passed
 * in a request
 */
export interface RequestOptions {
    /**
     * URL to send request
     */
    readonly url: uri;

    /**
     * Type of request to send
     */
    readonly type: RequestType;

    /**
     * Request headers
     */
    readonly headers?: RequestHeaders;

    /**
     * Type of the data being passed
     */
    readonly dataType?: RequestDataType;

    /**
     * Data to accompany the request
     */
    readonly data?: any;

    /**
     * URL encoded form data for the request
     */
    readonly urlEncodedForm?: any;
}

/**
 * Interface for a successful
 * request sent
 */
export interface RequestSuccess {
    success(data?: any): void;
}

/**
 * Static functions for RequestSuccess
 */
export class RequestSuccess {
    /**
     * Make a RequestSuccess
     * @param operation Success function
     * @returns RequestSuccess
     */
    public static make(operation: (data?: any) => void): RequestSuccess {
        return {
            success: operation
        };
    }
}

/**
 * Abstract class for an API that sends Http requests
 */
export abstract class HttpRequestAPI {
    /**
     * Creates an instance of an HttpRequestAPI
     */
    constructor() {
    }

    /**
     * Send a DELETE request
     * @param options Request options
     * @param success Request success to call on success
     * @param error Request error to call on error
     */
    abstract delete(options: RequestOptions, success: RequestSuccess, error: RequestError): void;

    /**
     * Send a GET request
     * @param options Request options
     * @param success Request success to call on success
     * @param error Request error to call on error
     */
    abstract get(options: RequestOptions, success: RequestSuccess, error: RequestError): void;
    
    /**
     * Send a POST request
     * @param options Request options
     * @param success Request success to call on success
     * @param error Request error to call on error
     */
    abstract post(options: RequestOptions, success: RequestSuccess, error: RequestError): void;

    /**
     * Send a PUT request
     * @param options Request options
     * @param success Request success to call on success
     * @param error Request error to call on error
     */
    abstract put(options: RequestOptions, success: RequestSuccess, error: RequestError): void;

    /**
     * Routes request to the appropriate call based on Request Type
     * @param options Request options
     * @param success Request success to call on success
     * @param error Request error to call on error
     */
    send(options: RequestOptions, success: RequestSuccess, error: RequestError): void {
        // Decide which type of request to send
        switch (options.type) {
            case RequestType.DELETE:
                this.delete(options, success, error);
                break;
            case RequestType.GET:
                this.get(options, success, error);
                break;
            case RequestType.POST:
                this.post(options, success, error);
                break;
            case RequestType.PUT:
                this.put(options, success, error);
                break;
            default:
                error.error(-1, "Unsupported Request Type");
                break;
        }
    }
}
