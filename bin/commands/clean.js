import { removeMultipleAsync } from '../../src/rm.js'
import { fileExists, match } from '../../src/util.js'

/**
 * @typedef Options
 * @property {string} bundle Clean bundled build artifacts
 * @property {string} minify Clean minified build artifacts
 * @property {string} typings Clean typing artifacts
 * @property {string} custom Clean based on a user-defined pattern
 * @property {boolean} force Ignore errors
 */

/**
 * Clean build artifcats using sensible defaults
 * @param {string} cwd Current working directory
 * @param {Options} options 'clean' options
 */
export async function clean (cwd, options) {
  const exists = await fileExists(cwd)
  if (!exists) {
    console.error(`clean: ${cwd} No such file or directory`)
    process.exitCode = 1
    return
  }

  if (options?.bundle) {
    await cleanCategory(cwd, options.bundle, options)
  }

  if (options?.minify) {
    await cleanCategory(cwd, options.minify, options)
  }

  if (options?.typings) {
    await cleanCategory(cwd, options.typings, options)
  }

  if (options?.custom) {
    await cleanCategory(cwd, options.custom, options)
  }
}

/**
 * Clean one category of build artifacts
 * @private
 * @param {string} cwd the current working directory (default process.cwd())
 * @param {string} glob the pattern of files to match
 * @param {Options} options 'clean' options
 */
async function cleanCategory (cwd, glob, options) {
  const files = await match(glob, cwd, 'node_modules/**')
  await removeMultipleAsync(files, options?.force)
}
