import { exec } from 'child_process'
import { access, constants, glob } from 'node:fs/promises'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

/**
 * Expand file/glob into a list of paths
 *
 * @param {*} source the source file/glob
 * @returns {Promise<string[]>} an array of paths
 */
export async function expand (source) {
  const isGlob = source.includes('*')
  if (isGlob) {
    const paths = await match(source)
    if (paths.length === 0) {
      console.error(`${source} no matches found`)
      process.exit(1)
    }
    return paths
  } else {
    const exists = await fileExists(source)
    if (!exists) {
      console.error(`${source} No such file or directory`)
      process.exit(1)
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
  } catch (e) {
    return false
  }
}

/**
 * Description
 * @param {string} pattern glob pattern(s) to match
 * @param {string} root root path where the matcher runs from
 * @param {string} ignore glob of pattern(s) to ignore
 * @returns {Promise<string[]>} an array of paths
 */
export async function match (pattern, root = process.cwd(), ignore = null) {
  if (ignore) {
    const ignores = ignore.includes(',') ? [ignore] : ignore.split(',')
    return await Array.fromAsync(glob(pattern, { cwd: root, exclude: ignores }))
  }
  return await Array.fromAsync(glob(pattern, { cwd: root }))
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
  } catch (e) {
    return false
  }
}
