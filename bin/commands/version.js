import { ValidationError } from '../../src/errors.js'
import { JSR } from '../../src/jsr.js'
import { Repository } from '../../src/git/repository.js'
import { isGitRepo } from '../../src/git/utils.js'
import { isReleaseType, isValidVersion } from '../../src/semver/validate.js'
import { Version } from '../../src/semver/version.js'
import { Package } from '../../src/npm/package.js'
import { PackageLock } from '../../src/npm/package-lock.js'
import { exists, which } from '../../src/util.js'
import { resolve } from 'node:path'

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
    process.exitCode = 1
    return
  }

  if (!isGitRepo(cwd)) {
    console.error('version: Not a git repository')
    process.exitCode = 1
    return
  }

  Repository.cwd = cwd
  if (!Repository.isWorkingTreeClean(cwd)) {
    console.error('version: Git working directory not clean')
    process.exitCode = 1
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
  /** @type {Version} */
  let next
  if (isReleaseType(release)) {
    next = new Version(current)
    next.bump(release, preid)
  } else if (isValidVersion(release.replace(/^v/, ''))) {
    next = new Version(release)
  } else {
    throw new ValidationError(`Not a valid release-type or SemVer: ${release}`)
  }

  if (`${next}` === current) {
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
 * @param {Version} next Next version
 * @param {string} [cwd] Current working directory
 */
async function npmVersion (next, cwd = process.cwd()) {
  // Update 'package.json' if it exists
  const pkgExists = await exists(resolve(cwd, 'package.json'))
  if (pkgExists) {
    const pkg = new Package(cwd)
    pkg.version = `${next}`
    pkg.save()
  }

  // Update 'package-lock.json' if it exists
  const pkgLockExists = await exists(resolve(cwd, 'package-lock.json'))
  if (pkgLockExists) {
    const pkgLock = new PackageLock(cwd)
    pkgLock.version = `${next}`
    pkgLock.save()
  }
}

/**
 * Bump the JSR Version
 * @private
 * @param {Version} next Next version
 * @param {string} [cwd] Current working directory
 */
async function jsrVersion (next, cwd = process.cwd()) {
  // 'jsr.json'
  const jsrExists = await exists(resolve(cwd, 'jsr.json'))
  if (!jsrExists) {
    return
  }
  const jsr = new JSR(cwd)
  jsr.version = `${next}`
  jsr.save()
}

/**
 * Tag and commit the version in Git
 * @private
 * @param {Version} next Next version
 * @param {string} [message] Git commit message (%s is replaced with the version number in the message)
 * @param {string} [cwd] Current working directory
 */
async function gitVersion (next, message = 'v%s', cwd = process.cwd()) {
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

  message = message.replace(/%s/g, `${next}`)
  message = JSON.stringify(message)
  Repository.commit(message, cwd)

  Repository.tag(`${next}`, message, cwd)
}
