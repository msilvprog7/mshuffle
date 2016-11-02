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
        let requestOptions = this.getRequestOptions("DELETE", options),
            callback = this.getCallback(success, error);
        
        request.del(requestOptions, callback);
    }

    /**
     * Send an Http GET request using request
     * @param options Request options
     * @param success Request success to call on success
     * @param error Request error to call on error
     */
    get(options: RequestOptions, success: RequestSuccess, error: RequestError): void {
        let requestOptions = this.getRequestOptions("DELETE", options),
            callback = this.getCallback(success, error);

        request.get(requestOptions, callback);
    }

    /**
     * Send an Http POST request using request
     * @param options Request options
     * @param success Request success to call on success
     * @param error Request error to call on error
     */
    post(options: RequestOptions, success: RequestSuccess, error: RequestError): void {
        let requestOptions = this.getRequestOptions("DELETE", options),
            callback = this.getCallback(success, error);

        request.post(requestOptions, callback);
    }

    /**
     * Send an Http PUT request using request
     * @param options Request options
     * @param success Request success to call on success
     * @param error Request error to call on error
     */
    put(options: RequestOptions, success: RequestSuccess, error: RequestError): void {
        let requestOptions = this.getRequestOptions("DELETE", options),
            callback = this.getCallback(success, error);
            
        request.put(requestOptions, callback);
    }

    /**
     * Get Request options
     * @param type Request type
     * @param options Request options
     * @returns Request module's needed request options
     */
    private getRequestOptions(type: string, options: RequestOptions): request.RequiredUriUrl & request.CoreOptions {
        return {
            url: options.url,
            method: type,
            headers: options.headers,
            json: (options.dataType !== undefined && options.dataType === RequestDataType.JSON),
            body: (options.data !== undefined) ? options.data : undefined,
            form: (options.urlEncodedForm !== undefined)? options.urlEncodedForm : undefined
        };
    }

    /**
     * Get callback
     * @param success Request success
     * @param error Request error
     * @returns Callback function for Request module
     */
    private getCallback(success: RequestSuccess, error: RequestError): request.RequestCallback {
        return function (errorResponse, incomingMessage, responseBody) {
            if (errorResponse) {
                error.error(errorResponse.status, errorResponse.message);
            } else if (incomingMessage.statusCode !== 200) {
                error.error(incomingMessage.statusCode, incomingMessage.statusMessage)
            } else if (responseBody && responseBody.error) {
                error.error(responseBody.error.status, responseBody.error.message);
            } else {
                success.success(responseBody);
            }
        };
    }
}
