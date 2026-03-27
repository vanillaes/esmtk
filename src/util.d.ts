/**
 * Expand file/glob into a list of paths
 * @param {string} source the source file/glob
 * @returns {Promise<string[]>} an array of paths
 */
export function expand(source: string): Promise<string[]>;
/**
 * Check if a file/folder exists
 * @param {string} path the path to the file/folder
 * @returns {Promise<boolean>} trie if the file/folder exists, false otherwise
 */
export function fileExists(path: string): Promise<boolean>;
/**
 * Check to see if a NPM package is installed globally
 * @param {string} pkg the name of the package
 * @returns {Promise<boolean>} true if the package is installed, false otherwise
 */
export function installed(pkg: string): Promise<boolean>;
/**
 * Description
 * @param {string} pattern glob pattern(s) to match
 * @param {string} cwd the current working directory
 * @param {string} ignore glob of pattern(s) to ignore
 * @returns {Promise<string[]>} an array of paths
 */
export function match(pattern: string, cwd?: string, ignore?: string): Promise<string[]>;
/**
 * Check to see if an application is installed globally
 * @param {string} program the name of the application
 * @returns {Promise<boolean>} true if the application is installed, false otherwise
 */
export function which(program: string): Promise<boolean>;
