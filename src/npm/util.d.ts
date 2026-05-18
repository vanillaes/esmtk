/**
 * Check to see if a NPM package is installed globally
 * @param {string} pkg Package name
 * @returns {Promise<boolean>} True if the package is installed, false otherwise
 */
export function installed(pkg: string): Promise<boolean>;
/**
 * Locate the local npm package directory
 * @param {string} [cwd] Current working directory
 * @returns {string} The local npm bin directory
 */
export function localBin(cwd?: string): string;
/**
 * Locate the global npm package directory
 * @returns {string} The global npm bin
 */
export function globalBin(): string;
/**
 * Run a npm command, returning stdout (trimmed). Throws on non-zero exit.
 * @param {string} args Arguments
 * @param {string} [cwd] Current working directory
 * @returns {string} Returns stdout/stderr output
 */
export function npmSync(args: string, cwd?: string): string;
/**
 * Read .npmignore
 * @param {string} [cwd] Current working directory
 * @returns {Promise<string>} Comma-deliminated list of ignore globs
 */
export function readNPMIgnore(cwd?: string): Promise<string>;
/**
 * Run a command from local and globally unstalled packages
 * @param {string} cmd Command
 * @param {string[]} args Script name
 * @param {string} [cwd] Current working directory
 * @param {boolean} [unsafe] Unsafe mode (Include ENV:PATH)
 * @returns {Promise<number>} Exit code of the script
 */
export function runCommand(cmd: string, args: string[], cwd?: string, unsafe?: boolean): Promise<number>;
/**
 * Run a script from package.json
 * @param {string} name Script name
 * @param {string} [cwd] Current working directory
 * @returns {Promise<number>} Exit code of the script
 */
export function runScript(name: string, cwd?: string): Promise<number>;
