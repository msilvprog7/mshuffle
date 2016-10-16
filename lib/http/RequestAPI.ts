import {HttpRequestAPI, RequestDataType, RequestError, RequestOptions, RequestSuccess} from "../../shared/http";
import * as request from "request";

/**
 * Request API for making http requests
 */
export default class RequestAPI extends HttpRequestAPI {
    /**
     * Creates an instance of a RequestAPI
     */
    constructor(public cache: boolean = false) {
        super();
    }

    /**
     * Send an Http DELETE request using request
     * @param options Request options
     * @param success Request success to call on success
     * @param error Request error to call on error
     */
    delete(options: RequestOptions, success: RequestSuccess, error: RequestError): void {
        this.request("DELETE", options, success, error);
    }

    /**
     * Send an Http GET request using request
     * @param options Request options
     * @param success Request success to call on success
     * @param error Request error to call on error
     */
    get(options: RequestOptions, success: RequestSuccess, error: RequestError): void {
        this.request("GET", options, success, error);
    }

    /**
     * Send an Http POST request using request
     * @param options Request options
     * @param success Request success to call on success
     * @param error Request error to call on error
     */
    post(options: RequestOptions, success: RequestSuccess, error: RequestError): void {
        this.request("POST", options, success, error);
    }

    /**
     * Send an Http PUT request using request
     * @param options Request options
     * @param success Request success to call on success
     * @param error Request error to call on error
     */
    put(options: RequestOptions, success: RequestSuccess, error: RequestError): void {
        this.request("PUT", options, success, error);
    }

    /**
     * Send an Http request using request
     * @param type Request type as string
     * @param options Request options
     * @param success Request success to call on success
     * @param error Request error to call on error
     */
    private request(type: string, options: RequestOptions, success: RequestSuccess, error: RequestError): void {
        let reqOptions = {
            url: options.url,
            method: type,
            headers: options.headers,
            json: (options.dataType !== undefined && options.dataType === RequestDataType.JSON),
            body: (options.data !== undefined) ? options.data : undefined,
            form: (options.urlEncodedForm !== undefined)? options.urlEncodedForm : undefined
        };

        let reqCallback: request.RequestCallback = function (errorResponse, incomingMessage, responseBody): void {
            if (errorResponse) {
                error.error(errorResponse.status, errorResponse.message);
            } else if (incomingMessage.statusCode !== 200) {
                error.error(incomingMessage.statusCode, incomingMessage.statusMessage)
            } else if (responseBody && responseBody.error) {
                error.error(responseBody.error.status, responseBody.error.message);
            } else if (responseBody) {
                success.success(responseBody);
            }
        };

        request(reqOptions, reqCallback);
    }
}
