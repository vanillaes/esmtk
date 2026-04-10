import { cleanAsync, exists, match } from '../../src/index.js'

/**
 * Clean build artifcats using sensible defaults
 * @param {string} cwd Current working directory
 * @param {object} options 'clean' options
 * @param {string} options.bundle Clean bundled build artifacts
 * @param {string} options.minify Clean minified build artifacts
 * @param {string} options.typings Clean typing artifacts
 * @param {string} options.custom Clean based on a user-defined pattern
 * @param {boolean} options.force Ignore errors
 */
export async function clean (cwd, options) {
  const cwdExists = await exists(cwd)
  if (!cwdExists) {
    console.error(`clean: ${cwd} No such file or directory`)
    process.exitCode = 1
    return
  }

  if (options?.bundle) {
    await cleanCategory(cwd, options.bundle, options?.force)
  }

  if (options?.minify) {
    await cleanCategory(cwd, options.minify, options?.force)
  }

  if (options?.typings) {
    await cleanCategory(cwd, options.typings, options?.force)
  }

  if (options?.custom) {
    await cleanCategory(cwd, options?.custom, options?.force)
  }
}

/**
 * Clean one category of build artifacts
 * @private
 * @param {string} cwd the current working directory (default process.cwd())
 * @param {string} glob the pattern of files to match
 * @param {boolean} force Ignore errors
 */
async function cleanCategory (cwd, glob, force = false) {
  const files = await match(glob, cwd, 'node_modules/**')
  await cleanAsync(files, force)
}
