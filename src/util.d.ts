/**
 * Check if a file/folder exists
 * @param {string} path Path to the file/folder
 * @returns {Promise<boolean>} True if the file/folder exists, false otherwise
 */
export function exists(path: string): Promise<boolean>;
/**
 * Check if a file/folder exists
 * @deprecated
 * @param {string} path Path to the file/folder
 * @returns {Promise<boolean>} True if the file/folder exists, false otherwise
 */
export function fileExists(path: string): Promise<boolean>;
/**
 * Match glob(s)
 * @param {string} pattern Glob pattern(s) to match
 * @param {string} [cwd] Current working directory
 * @param {string} [ignore] Glob of pattern(s) to ignore
 * @param {boolean} [unsafe] Allow file access outside of CWD
 * @returns {Promise<string[]>} An array of paths
 */
export function match(pattern: string, cwd?: string, ignore?: string, unsafe?: boolean): Promise<string[]>;
/**
 * Match all glob(s)
 * @param {string[]} patterns Glob pattern(s) to match
 * @param {string} [cwd] Current working directory
 * @param {string[]} [exclude] Glob pattern(s) to exclude
 * @param {boolean} [unsafe] Allow file access outside of CWD
 * @returns {Promise<string[]>} An array of paths
 */
export function matchAll(patterns: string[], cwd?: string, exclude?: string[], unsafe?: boolean): Promise<string[]>;
/**
 * Check to see if an application is installed globally
 * @param {string} program Name of the application
 * @returns {Promise<boolean>} True if the application is installed, false otherwise
 */
export function which(program: string): Promise<boolean>;
export const execAsync: typeof exec.__promisify__;
import { exec } from 'node:child_process';
