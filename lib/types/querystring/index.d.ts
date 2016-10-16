/**
 * Minimal type declarations for querystring
 */

/**
 * Querystring namespace
 */
declare namespace querystring {
    /**
     * Compose as query string
     * @param queries Queries to Compose
     * @returns Query string 
     */
    export function stringify(queries: any): string;
}

/**
 * Export namespace
 */
export = querystring;
