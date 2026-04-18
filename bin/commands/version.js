import { exists, JSR, Package, PackageLock } from '../../src/index.js'
import { execSync } from 'node:child_process'
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
 * @param {object} options 'version' options
 * @param {boolean|undefined} [options.allowSameVersion] Allow the same version
 * @param {string|undefined} [options.cwd] Current working directory
 * @param {boolean|undefined} [options.gitTagVersion] Tag the version in git?
 * @param {string|undefined} [options.message] Git commit message (%s is replaced with the version number in the message)
 * @param {string|undefined} [options.preid] Pre-release identifier (ex 'rc' -> 1.2.0-rc.8)
 */
export async function version (release, options = {}) {
  const {
    cwd = process.cwd(),
    gitTagVersion = true,
  } = options

  if (!release) {
    throw new Error('version: Missing release type or version')
  }

  const useGit = gitTagVersion && isGitRepo(cwd)
  if (useGit && !isWorkingTreeClean(cwd)) {
    throw new Error('version: Git working directory not clean.')
  }

  const pkg = new Package()

  if (pkg.scripts?.preversion) {
    const code = await pkg.runScript('preversion')
    if (code === 1) {
      process.exitCode = 1
      return
    }
  }

  let next
  try {
    next = await npmVersion(release, options)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }

  try {
    await jsrVersion(next, options)
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

  if (!useGit) {
    console.log(`v${next}`)
    return
  }

  try {
    await gitVersion(next, options)
  } catch (error) {
    console.error(error)
    process.exit(1)
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
 * @param {object} options 'npmVersion' options
 * @param {boolean|undefined} [options.allowSameVersion] Allow the same version
 * @param {string|undefined} [options.cwd] Current working directory
 * @param {string} [options.preid] Pre-release identifier (ex 'rc' -> 1.2.0-rc.8)
 * @returns {Promise<string>} Next version
 */
async function npmVersion (release, options = {}) {
  const {
    cwd = process.cwd(),
    preid,
    allowSameVersion = false,
  } = options

  // 'package.json'
  const pkgExists = await exists(resolve(cwd, 'package.json'))
  if (!pkgExists) {
    throw new Error('version: no package.json found')
  }
  const pkg = new Package(cwd)
  const current = pkg.version || '0.0.0'
  const next = incrementVersion(current, release, preid)
  if (next === current && !allowSameVersion) {
    throw new Error('version: Version not changed, might want --allow-same-version')
  }
  pkg.version = next
  pkg.save()

  // Update 'package-lock.json' if it exists
  const pkgLockExists = await exists(resolve(cwd, 'package-lock.json'))
  if (pkgLockExists) {
    const pkgLock = new PackageLock(cwd)
    pkgLock.version = next
    pkgLock.save()
  }

  return next
}

/**
 * Bump the JSR Version
 * @private
 * @param {string} release Release type/number
 * @param {object} options 'jsrVersion' options
 * @param {string|undefined} [options.cwd] Current working directory
 */
async function jsrVersion (release, options = {}) {
  const {
    cwd = process.cwd(),
  } = options

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
 * @param {object} options 'gitVersion' options
 * @param {string|undefined} [options.cwd] Current working directory
 * @param {string|undefined} [options.message] Git commit message (%s is replaced with the version number in the message)
 */
async function gitVersion (release, options = {}) {
  const {
    cwd = process.cwd(),
    message = 'v%s',
  } = options

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

  git(`add ${filesToAdd.join(' ')}`, cwd)
  const commitMsg = message.replace(/%s/g, release)
  git(`commit -m ${JSON.stringify(commitMsg)}`, cwd)
  git(`tag -a v${release} -m ${JSON.stringify(commitMsg)}`, cwd)
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

/**
 * Run a git command, returning stdout (trimmed). Throws on non-zero exit.
 * @private
 * @param {string} args Arguments
 * @param {string} cwd Current working directory
 * @returns {string} Returns stdout/stderr output
 */
function git (args, cwd) {
  return execSync(`git ${args}`, { cwd, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim()
}

/**
 * Is this a git repository?
 * @private
 * @param {string} cwd Current working directory
 * @returns {boolean} Returns true if this package is a git repo, otherwise false.
 */
function isGitRepo (cwd) {
  try {
    git('rev-parse --is-inside-work-tree', cwd)
    return true
  } catch {
    return false
  }
}

/**
 * Is the git working tree clean of uncommitted changes?
 * @param {string} cwd Current working directory
 * @returns {boolean} Returns true if the working tree is clean, otherwise false
 */
function isWorkingTreeClean (cwd) {
  const out = git('status --porcelain', cwd)
  return out.length === 0
}
