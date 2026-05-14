/**
 * Check to see if a NPM package is installed globally
 * @param {string} pkg Package name
 * @returns {Promise<boolean>} True if the package is installed, false otherwise
 */
export function installed(pkg: string): Promise<boolean>;
/**
 * Read .npmignore
 * @param {string} [cwd] Current working directory
 * @returns {Promise<string>} Comma-deliminated list of ignore globs
 */
export function readNPMIgnore(cwd?: string): Promise<string>;
/**
 * Run a script from package.json, like `npm run <name>`
 * @param {string} name Script name
 * @param {object} options 'runScript' options
 * @param {string} [options.cwd] Current working directory
 * @param {NodeJS.ProcessEnv} [options.env] Current environment
 * @returns {Promise<number>} Exit code of the script
 */
export function runScript(name: string, options?: {
    cwd?: string | undefined;
    env?: NodeJS.ProcessEnv | undefined;
}): Promise<number>;
