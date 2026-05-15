import { parse } from './parse.js'
import { stringify } from './stringify.js'
import { isReleaseType } from './validate.js'
import { ValidationError } from '../errors.js'

export class Version {
  /**
   * @param {string|undefined} [version] The version string (ex 1.2.3)
   */
  constructor (version) {
    if (version) {
      // Allow leading 'v'
      const cleaned = version.replace(/^v/, '')
      Object.assign(this, parse(cleaned))
    }
  }

  /**
   * @type {number}
   */
  major = 0

  /**
   * @type {number}
   */
  minor = 0

  /**
   * @type {number}
   */
  patch = 0

  /**
   * @type {(string|number)[]}
   */
  prerelease = []

  /**
   * @type {string[]}
   */
  build = []

  /**
   * Increment a version according to a release type.
   * @param {string} release major | minor | patch | premajor | preminor | prepatch | prerelease
   * @param {string|undefined} [preid] Optional prerelease identifier (e.g., 'beta')
   */
  bump (release, preid) {
    if (!isReleaseType(release)) {
      throw new ValidationError('Not a valid release-type')
    }

    switch (release) {
      case 'major':
        this.major = this.major + (this.prerelease?.length && this.minor === 0 && this.patch === 0 ? 0 : 1)
        this.minor = 0
        this.patch = 0
        this.prerelease = []
        this.build = []
        break
      case 'minor':
        this.minor = this.minor + (this.prerelease?.length && this.patch === 0 ? 0 : 1)
        this.patch = 0
        this.prerelease = []
        this.build = []
        break
      case 'patch':
        this.patch = this.patch + (this.prerelease?.length ? 0 : 1)
        this.prerelease = []
        this.build = []
        break
      case 'premajor':
        this.major = this.major + 1
        this.minor = 0
        this.patch = 0
        this.prerelease = preid ? [preid, 0] : [0]
        this.build = []
        break
      case 'preminor':
        this.minor = this.minor + 1
        this.patch = 0
        this.prerelease = preid ? [preid, 0] : [0]
        this.build = []
        break
      case 'prepatch':
        this.patch = this.patch + 1
        this.prerelease = preid ? [preid, 0] : [0]
        this.build = []
        break
      case 'prerelease':
        if (this.prerelease?.length === 0) {
          // Behave like prepatch when there is no current prerelease.
          this.patch = this.patch + 1
          this.prerelease = preid ? [preid, 0] : [0]
          this.build = []
        } else {
          this.prerelease = bumpPrerelease(this.prerelease, preid)
          this.build = []
        }
        break
      default:
        throw new Error(`Unknown release type: ${release}`)
    }
  }

  /**
   * Convert the version to a string
   * @returns {string} Version string
   */
  toString () {
    return stringify(this)
  }

  toValue () {
    /**
     * Convert version to a value for comparison
     * @returns {string} Version string
     */
  }
}

/**
 * Bump prerelease identifiers. If the last identifier is numeric, increment it.
 * @private
 * @param {(number|string)[]} prerelease Pre-release number (default: 0)
 * @param {string|undefined} [preid] Pre-release ID
 * @returns {(number|string)[]} The next pre-release version
 */
function bumpPrerelease (prerelease, preid) {
  // If a preid is provided and current prerelease doesn't start with it, reset.
  if (preid) {
    if (prerelease[0] !== preid) return [preid, 0]
  }
  if (prerelease.length === 0) {
    return preid ? [preid, 0] : [0]
  }
  // Find the last numeric identifier and increment it.
  const out = [...prerelease]
  for (let i = out.length - 1; i >= 0; i--) {
    if (/^\d+$/.test(String(out[i]))) {
      out[i] = Number(out[i]) + 1
      return out
    }
  }
  out.push(0)
  return out
}
