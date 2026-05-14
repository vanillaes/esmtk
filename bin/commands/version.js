import { JSR } from '../../src/jsr.js'
import { Repository } from '../../src/git/repository.js'
import { isGitRepo } from '../../src/git/utils.js'
import { Package } from '../../src/npm/package.js'
import { PackageLock } from '../../src/npm/package-lock.js'
import { exists, which } from '../../src/util.js'
import { resolve } from 'node:path'

const VALID_RELEASES = ['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease']

/**
 * @typedef {object} Version
 * @property {number} major Major
 * @property {number} minor Minor
 * @property {number} patch Patch
 * @property {(string|number)[]} prerelease Pre-release
 * @property {string[]|undefined} [build] Build
 */

/**
 * Bump the package version and tag the release in Git
 * @param {string} release major | minor | patch | premajor | preminor | prepatch | prerelease | <version>
 * @param {object} [options] 'version' options
 * @param {string} [options.cwd] Current working directory
 * @param {boolean} [options.gitTagVersion] Tag the version in git?
 * @param {string} [options.message] Git commit message, %s will be replace with the version number (default: v%s)
 * @param {string} [options.preid] Pre-release identifier (ex 'rc' -> 1.2.0-rc.8)
 */
export async function version (release, options = {}) {
  const {
    cwd = process.cwd(),
    gitTagVersion = true,
    message = 'v%s',
    preid
  } = options

  if (!release) {
    throw new Error('version: Missing release type or version')
  }

  const gitExists = await which('git')
  if (!gitExists) {
    console.error('version: Git not found')
    process.exit(1)
    return
  }

  if (!isGitRepo(cwd)) {
    console.error('version: Not a git repository')
    process.exit(1)
    return
  }

  Repository.cwd = cwd
  if (!Repository.isWorkingTreeClean(cwd)) {
    console.error('version: Git working directory not clean')
    process.exit(1)
    return
  }

  const pkg = new Package()
  if (pkg.scripts?.preversion) {
    const code = await pkg.runScript('preversion')
    if (code === 1) {
      process.exitCode = 1
      return
    }
  }

  const current = Repository.latestRelease()
  const next = incrementVersion(current, release, preid)
  if (next === current) {
    throw new Error('version: Version not changed')
  }

  try {
    await npmVersion(next, cwd)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }

  try {
    await jsrVersion(next, cwd)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }

  if (pkg.scripts?.version) {
    const code = await pkg.runScript('version')
    if (code === 1) {
      process.exitCode = 1
      return
    }
  }

  if (gitTagVersion) {
    try {
      await gitVersion(next, message)
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  }

  if (pkg.scripts?.postversion) {
    const code = await pkg.runScript('postversion')
    if (code === 1) {
      process.exitCode = 1
      return
    }
  }

  console.log(`v${next}`)
}

/**
 * Bump the NPM Version
 * @private
 * @param {string} release Release type/number
 * @param {string} [cwd] Current working directory
 */
async function npmVersion (release, cwd = process.cwd()) {
  // Update 'package.json' if it exists
  const pkgExists = await exists(resolve(cwd, 'package.json'))
  if (pkgExists) {
    const pkg = new Package(cwd)
    pkg.version = release
    pkg.save()
  }

  // Update 'package-lock.json' if it exists
  const pkgLockExists = await exists(resolve(cwd, 'package-lock.json'))
  if (pkgLockExists) {
    const pkgLock = new PackageLock(cwd)
    pkgLock.version = release
    pkgLock.save()
  }
}

/**
 * Bump the JSR Version
 * @private
 * @param {string} release Release type/number
 * @param {string} [cwd] Current working directory
 */
async function jsrVersion (release, cwd = process.cwd()) {
  // 'jsr.json'
  const jsrExists = await exists(resolve(cwd, 'jsr.json'))
  if (!jsrExists) {
    return
  }
  const jsr = new JSR(cwd)
  jsr.version = release
  jsr.save()
}

/**
 * Tag and commit the version in Git
 * @private
 * @param {string} release Release type/number
 * @param {string} [message] Git commit message (%s is replaced with the version number in the message)
 * @param {string} [cwd] Current working directory
 */
async function gitVersion (release, message = 'v%s', cwd = process.cwd()) {
  const filesToAdd = []
  const pkgExists = await exists(resolve(cwd, 'package.json'))
  if (pkgExists) {
    filesToAdd.push('package.json')
  }
  const pkgLockExists = await exists(resolve(cwd, 'package-lock.json'))
  if (pkgLockExists) {
    filesToAdd.push('package-lock.json')
  }
  const jsrExists = await exists(resolve(cwd, 'jsr.json'))
  if (jsrExists) {
    filesToAdd.push('jsr.json')
  }
  Repository.add(filesToAdd, cwd)

  message = message.replace(/%s/g, release)
  message = JSON.stringify(message)
  Repository.commit(message, cwd)

  Repository.tag(release, message, cwd)
}

/**
 * Parse a semver string into its components
 * Supports: MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
 * @private
 * @param {string} version The string version of a version
 * @returns {Version} The version split into parts
 */
export function parseVersion (version) {
  const re = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+([0-9A-Za-z.-]+))?$/
  const m = re.exec(version)
  if (!m) throw new Error(`Invalid version: ${version}`)
  return {
    major: Number(m[1]),
    minor: Number(m[2]),
    patch: Number(m[3]),
    prerelease: m[4] ? m[4].split('.') : [],
    build: m[5] ? m[5].split('.') : [],
  }
}

/**
 * Stringify a parsed version object
 * @private
 * @param {Version} v Version number
 * @returns {string} The stringified version number
 */
function stringifyVersion (v) {
  let output = `${v.major}.${v.minor}.${v.patch}`
  if (v.prerelease?.length) {
    output += `-${v.prerelease.join('.')}`
  }
  if (v.build?.length) {
    output += `+${v.build.join('.')}`
  }
  return output
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

/**
 * Increment a version according to a release type.
 * @private
 * @param {string} current Current version
 * @param {string} release major | minor | patch | premajor | preminor | prepatch | prerelease | <version>
 * @param {string|undefined} [preid] Optional prerelease identifier (e.g., 'beta')
 * @returns {string} The next release version number
 */
function incrementVersion (current, release, preid) {
  // Explicit version passed in?
  if (!VALID_RELEASES.includes(release)) {
    // Allow leading 'v'
    const cleaned = release.replace(/^v/, '')
    parseVersion(cleaned) // validate
    return cleaned
  }

  const v = parseVersion(current)

  switch (release) {
    case 'major':
      return stringifyVersion({ major: v.major + (v.prerelease.length && v.minor === 0 && v.patch === 0 ? 0 : 1), minor: 0, patch: 0, prerelease: [], build: [] })
    case 'minor':
      return stringifyVersion({ major: v.major, minor: v.minor + (v.prerelease.length && v.patch === 0 ? 0 : 1), patch: 0, prerelease: [], build: [] })
    case 'patch':
      return stringifyVersion({ major: v.major, minor: v.minor, patch: v.prerelease.length ? v.patch : v.patch + 1, prerelease: [], build: [] })
    case 'premajor':
      return stringifyVersion({ major: v.major + 1, minor: 0, patch: 0, prerelease: preid ? [preid, 0] : [0], build: [] })
    case 'preminor':
      return stringifyVersion({ major: v.major, minor: v.minor + 1, patch: 0, prerelease: preid ? [preid, 0] : [0], build: [] })
    case 'prepatch':
      return stringifyVersion({ major: v.major, minor: v.minor, patch: v.patch + 1, prerelease: preid ? [preid, 0] : [0], build: [] })
    case 'prerelease': {
      if (v.prerelease.length === 0) {
        // Behave like prepatch when there is no current prerelease.
        return stringifyVersion({ major: v.major, minor: v.minor, patch: v.patch + 1, prerelease: preid ? [preid, 0] : [0], build: [] })
      }
      return stringifyVersion({ ...v, prerelease: bumpPrerelease(v.prerelease, preid), build: [] })
    }
    default:
      throw new Error(`Unknown release type: ${release}`)
  }
}
