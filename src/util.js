import { EACCESError } from './errors.js'
import { exec } from 'node:child_process'
import { resolve } from 'node:path'
import { access, constants, glob } from 'node:fs/promises'
import { promisify } from 'node:util'

export const execAsync = promisify(exec)

/**
 * Check if a file/folder exists
 * @param {string} path Path to the file/folder
 * @returns {Promise<boolean>} True if the file/folder exists, false otherwise
 */
export async function exists (path) {
  try {
    await access(path, constants.F_OK)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Check if a file/folder exists
 * @deprecated
 * @param {string} path Path to the file/folder
 * @returns {Promise<boolean>} True if the file/folder exists, false otherwise
 */
export async function fileExists (path) {
  return await exists(path)
}

/**
 * Match glob(s)
 * @param {string} pattern Glob pattern(s) to match
 * @param {string} [cwd] Current working directory
 * @param {string} [ignore] Glob of pattern(s) to ignore
 * @param {boolean} [unsafe] Allow file access outside of CWD
 * @returns {Promise<string[]>} An array of paths
 */
export async function match (pattern, cwd = process.cwd(), ignore = undefined, unsafe = false) {
  const patterns = pattern.includes(',') ? pattern.split(',') : [pattern]

  let exclude
  if (ignore) {
    exclude = ignore.includes(',') ? ignore.split(',') : [ignore]
  }

  const files = await Array.fromAsync(glob(patterns, { cwd, exclude }))

  if (!unsafe) {
    const cwdAbs = resolve(cwd)
    files.forEach(file => {
      // expand relative paths, don't expand absolute paths
      const fileAbs = !file.startsWith('/') ? resolve(cwd, file) : resolve(file)
      if (!fileAbs.startsWith(cwdAbs)) {
        throw new EACCESError(`Permission denied, traversal detected '${file}'`)
      }
    })
  }

  return files
}

/**
 * Match all glob(s)
 * @param {string[]} patterns Glob pattern(s) to match
 * @param {string} [cwd] Current working directory
 * @param {string[]} [exclude] Glob pattern(s) to exclude
 * @param {boolean} [unsafe] Allow file access outside of CWD
 * @returns {Promise<string[]>} An array of paths
 */
export async function matchAll (patterns, cwd = process.cwd(), exclude = undefined, unsafe = false) {
  const files = await Array.fromAsync(glob(patterns, { cwd, exclude }))

  if (!unsafe) {
    const cwdAbs = resolve(cwd)
    files.forEach(file => {
      // expand relative paths, don't expand absolute paths
      const fileAbs = !file.startsWith('/') ? resolve(cwd, file) : resolve(file)
      if (!fileAbs.startsWith(cwdAbs)) {
        throw new EACCESError(`Permission denied, traversal detected '${file}'`)
      }
    })
  }

  return files
}

/**
 * Check to see if an application is installed globally
 * @param {string} program Name of the application
 * @returns {Promise<boolean>} True if the application is installed, false otherwise
 */
export async function which (program) {
  try {
    await execAsync(`which ${program}`)
    return true
  } catch (error) {
    return false
  }
}
