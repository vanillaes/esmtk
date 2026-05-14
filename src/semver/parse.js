import { Version } from './version.js'

/**
 * Parse a semver string into a Version
 * Supports: MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
 * @param {string} version The string version of a version
 * @returns {Version} The version split into parts
 */
export function parse (version) {
  const re = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+([0-9A-Za-z.-]+))?$/
  const m = re.exec(version)
  if (!m) throw new Error(`Invalid version: ${version}`)
  const current = new Version()
  Object.assign(current, {
    major: Number(m[1]),
    minor: Number(m[2]),
    patch: Number(m[3]),
    prerelease: m[4] ? m[4].split('.') : [],
    build: m[5] ? m[5].split('.') : [],
  })
  return current
}
