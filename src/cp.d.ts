/**
 * Copy a single file asynchronously
 * @param {string} source The source file
 * @param {string} target The target file
 * @param {boolean} force If the file already exists, overwrite it (default false)
 */
export function copyAsync(source: string, target: string, force?: boolean): Promise<void>;
/**
 * Copy a multiple files/globs asynchronously
 * @param {string[]} sources The source files/globs
 * @param {string} target The target file
 * @param {boolean} force If the file already exists, overwrite it (default false)
 */
export function copyMultipleAsync(sources: string[], target: string, force?: boolean): Promise<void>;
/**
 * Recursively copy a directory asynchronously
 * @param {string} source The source directory
 * @param {string} target The target directory
 * @param {boolean} force If the file already exists, overwrite it (default false)
 */
export function copyRecursiveAsync(source: string, target: string, force?: boolean): Promise<void>;
