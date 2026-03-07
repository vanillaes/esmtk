import { exec } from 'child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

/**
 * Check to see if a NPM package is installed globally
 * @param {string} pkg the name of the package
 * @returns {boolean} true if the package is installed, false otherwise
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
 * @returns {boolean} true if the application is installed, false otherwise
 */
export async function which (program) {
  try {
    await execAsync(`which ${program}`)
    return true
  } catch (e) {
    return false
  }
}
