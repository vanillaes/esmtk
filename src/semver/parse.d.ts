/**
 * Parse a semver string into a Version
 * Supports: MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
 * @param {string} version The string version of a version
 * @returns {Version} The version split into parts
 */
export function parse(version: string): Version;
import { Version } from './version.js';
