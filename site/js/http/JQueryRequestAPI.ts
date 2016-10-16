import {HttpRequestAPI, RequestDataType, RequestError, RequestOptions, RequestSuccess} from "../../../shared/http";

import * as $ from "jquery";


/**
 * Site's API for sending requests using JQuery's Ajax call
 */
export default class JQueryRequestAPI extends HttpRequestAPI {
    /**
     * Creates an instance of a JQueryRequestAPI
     * @param cache Whether or not to cache requests, default false
     */
    constructor(public cache: boolean = false) {
        super();
    }

    /**
     * Send an Ajax DELETE request using JQuery
     * @param options Request options
     * @param success Request success to call on success
     * @param error Request error to call on error
     */
    delete(options: RequestOptions, success: RequestSuccess, error: RequestError): void {
        this.request("DELETE", options, success, error);
    }

    /**
     * Send an Ajax GET request using JQuery
     * @param options Request options
     * @param success Request success to call on success
     * @param error Request error to call on error
     */
    get(options: RequestOptions, success: RequestSuccess, error: RequestError): void {
        this.request("GET", options, success, error);
    }

    /**
     * Send an Ajax POST request using JQuery
     * @param options Request options
     * @param success Request success to call on success
     * @param error Request error to call on error
     */
    post(options: RequestOptions, success: RequestSuccess, error: RequestError): void {
        this.request("POST", options, success, error);
    }

    /**
     * Send an Ajax PUT request using JQuery
     * @param options Request options
     * @param success Request success to call on success
     * @param error Request error to call on error
     */
    put(options: RequestOptions, success: RequestSuccess, error: RequestError): void {
        this.request("PUT", options, success, error);
    }

    /**
     * Format the RequestDataType for an Ajax request
     * @param type Request data type
     * @returns Formatted string of the request data type
     */
    private formatDataType(type: RequestDataType): string {
        // From RequestDataType to string
        switch (type) {
            case RequestDataType.JSON:
                return "json";
            default:
                return "unknown";
        }
    }

    /**
     * Send an Ajax request using JQuery
     * @param type Request type as string
     * @param options Request options
     * @param success Request success to call on success
     * @param error Request error to call on error
     */
    private request(type: string, options: RequestOptions, success: RequestSuccess, error: RequestError): void {
        $.ajax({
            url: options.url,
            type: type,
            headers: options.headers,
            dataType: (options.dataType !== undefined) ? this.formatDataType(options.dataType) : undefined,
            data: options.data,
            success: success.success,
            error: function (xhr: JQueryXHR, textStatus: string, errorThrown: string) {
                error.error(xhr.status, xhr.statusText);
            }
        });
    }
}
