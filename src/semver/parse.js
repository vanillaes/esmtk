import { isValidVersion } from './validate.js'
import { Version } from './version.js'
import { ValidationError } from '../errors.js'

/**
 * Parse a semver string into a Version
 * @description
 * Supports MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
 * @param {string} version The string version of a version
 * @returns {Version} The version split into parts
 */
export function parse (version) {
  if (!isValidVersion(version)) {
    throw new ValidationError(`Invalid version: ${version}`)
  }

  const pattern = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+([0-9A-Za-z.-]+))?$/
  const match = pattern.exec(version)
  if (!match) {
    throw new Error(`Invalid version: ${version}`)
  }
  const current = new Version()
  Object.assign(current, {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] ? match[4].split('.') : [],
    build: match[5] ? match[5].split('.') : [],
  })
  return current
}
