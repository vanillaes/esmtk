import { exec } from 'child_process'
import { join } from 'node:path'
import { access, constants, glob, readFile } from 'node:fs/promises'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

/**
 * Expand file/glob into a list of paths
 * @param {string} source the source file/glob
 * @returns {Promise<string[]>} an array of paths
 */
export async function expand (source) {
  const isGlob = source.includes('*')
  if (isGlob) {
    const paths = await match(source)
    if (paths.length === 0) {
      console.error(`${source} no matches found`)
      process.exitCode = 1
      return []
    }
    return paths
  } else {
    const exists = await fileExists(source)
    if (!exists) {
      console.error(`${source} No such file or directory`)
      process.exitCode = 1
      return []
    }
    return [source]
  }
}

/**
 * Check if a file/folder exists
 * @param {string} path the path to the file/folder
 * @returns {Promise<boolean>} trie if the file/folder exists, false otherwise
 */
export async function fileExists (path) {
  try {
    await access(path, constants.F_OK)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Check to see if a NPM package is installed globally
 * @param {string} pkg the name of the package
 * @returns {Promise<boolean>} true if the package is installed, false otherwise
 */
export async function installed (pkg) {
  try {
    await execAsync(`npm list -g --depth=0 ${pkg}`)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Match glob(s)
 * @param {string} pattern glob pattern(s) to match
 * @param {string} cwd the current working directory
 * @param {string} [ignore] glob of pattern(s) to ignore
 * @returns {Promise<string[]>} an array of paths
 */
export async function match (pattern, cwd = process.cwd(), ignore = undefined) {
  const patterns = pattern.includes(',') ? pattern.split(',') : [pattern]
  if (ignore) {
    const ignores = ignore.includes(',') ? ignore.split(',') : [ignore]
    return await Array.fromAsync(glob(patterns, { cwd, exclude: ignores }))
  }
  return await Array.fromAsync(glob(patterns, { cwd }))
}

/**
 * Read .gitignore
 * @param {string} cwd the current working directory
 * @returns {Promise<string[]>} a comma-deliminated list of ignore globs
 */
export async function readGitIgnore (cwd) {
  const path = join(cwd, '.gitignore')
  const exists = await fileExists(path)
  if (!exists) {
    return []
  }
  const contents = await readFile(path, 'utf8')
  return contents
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
}

/**
 * Read .npmignore
 * @param {string} cwd the current working directory
 * @returns {Promise<string>} a comma-deliminated list of ignore globs
 */
export async function readNPMIgnore (cwd) {
  const path = join(cwd, '.npmignore')
  const contents = await readFile(path, 'utf8')
  return contents
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .join(',')
}

/**
 * Check to see if an application is installed globally
 * @param {string} program the name of the application
 * @returns {Promise<boolean>} true if the application is installed, false otherwise
 */
export async function which (program) {
  try {
    await execAsync(`which ${program}`)
    return true
  } catch (error) {
    return false
  }
}
