import { removeMultipleAsync } from '../../src/rm.js'
import { fileExists, match } from '../../src/util.js'

/**
 * Clean build artifcats using sensible defaults
 * @param {string} cwd the currnt working directory
 * @param {object} options 'clean' options
 */
export async function clean (cwd, options) {
  const exists = await fileExists(cwd)
  if (!exists) {
    console.error(`clean: ${cwd} No such file or directory`)
    process.exit(1)
  }

  if (options?.bundle) {
    await cleanOne(cwd, options.bundle, options)
  }

  if (options?.minify) {
    await cleanOne(cwd, options.minify, options)
  }

  if (options?.typings) {
    await cleanOne(cwd, options.typings, options)
  }

  if (options?.custom) {
    await cleanOne(cwd, options.custom, options)
  }
}

/**
 * Run one category of build artifacts
 * @param {string} cwd the current working directory (default process.cwd())
 * @param {string} glob the pattern of files to match
 * @param {object} options 'clean' options
 */
async function cleanOne (cwd, glob, options) {
  const files = await match(glob, cwd, 'node_modules/**')
  await removeMultipleAsync(files, options?.force)
}
