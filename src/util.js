import { exec } from 'child_process'
import { access, constants } from 'node:fs/promises'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

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
