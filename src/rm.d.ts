/**
 * Remove a file asynchronously
 * @param {string} path The file to delete
 * @param {boolean} force Ignore exceptions if the file doesn't exist (default false)
 */
export function removeAsync(path: string, force?: boolean): Promise<void>;
/**
 * Remove a multiple files/globs asynchronously
 * @param {string[]} files The files/globs to delete
 * @param {boolean} force If the file already exists, overwrite it (default false)
 */
export function removeMultipleAsync(files: string[], force?: boolean): Promise<void>;
/**
 * Recursively remove a file|directory asynchronously
 * @param {string} path The file|directory to remove
 * @param {boolean} force Ignore exceptions if the file|directory doesn't exist (default false)
 */
export function removeRecursiveAsync(path: string, force?: boolean): Promise<void>;
