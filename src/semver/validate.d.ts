/**
 * Validate a version string - MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
 * @description
 * Validation is more strict than the parser:
 * - major can be 0-999 (with no leading zeros)
 * - minor can be 0-999 (with no leading zeros)
 * - patch can be 0-999 (with no leading zeros)
 * - prereleases start with a - and can contain numbers/letters/period/dash
 * - builds start with a + and can contain numbers/letters/period/dash
 * Version triplets are limited to 0-999 for major|minor|patch with no leading zeros.
 * @param {string} value Version
 * @returns {boolean} True, if the version is valid SemVer. Otherwise, false.
 */
export function isValidVersion(value: string): boolean;
/**
 * Validate the release-type - major|minor|patch|premajor|preminor|prepatch|prerelease
 * @param {string} value Release
 * @returns {boolean} True if the value is a release type. Otherwise, false.
 */
export function isReleaseType(value: string): boolean;
