/**
 * File Access Error
 */
export class EACCESError extends Error {
    /**
     * @param {string} [message] Error message
     */
    constructor(message?: string);
    code: string;
}
export class ValidationError extends Error {
    /**
     * @param {string} message Error message
     */
    constructor(message: string);
    code: string;
}
