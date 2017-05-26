/**
 * generic callback object
 */
export interface ICallback {
    (error: Error, result?: number): void;
    (error: Error, result?: string): void;
    (error: Error, result?: any): void;
}
