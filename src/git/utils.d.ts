/**
 * Get the user.email from git
 * @returns {string} the user.email
 */
export function gitUserEmail(): string;
/**
 * Get the user.name from git
 * @returns {string} the user.name
 */
export function gitUserName(): string;
/**
 * Run a git command, returning stdout (trimmed). Throws on non-zero exit.
 * @param {string} args Arguments
 * @param {string} [cwd] Current working directory
 * @returns {string} Returns stdout/stderr output
 */
export function gitSync(args: string, cwd?: string): string;
/**
 * Is this a git repository?
 * @private
 * @param {string} [cwd] Current working directory
 * @returns {boolean} Returns true if this package is a git repo, otherwise false.
 */
export function isGitRepo(cwd?: string): boolean;
/**
 * Read .gitignore
 * @param {string} [cwd] Current working directory
 * @returns {Promise<string[]>} Comma-deliminated list of ignore globs
 */
export function readGitIgnore(cwd?: string): Promise<string[]>;
