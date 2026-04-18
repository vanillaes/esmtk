import { exists, match } from '../../src/index.js'
import { rm } from 'node:fs/promises'

/**
 * Clean build artifcats using sensible defaults
 * @param {object} [options] 'clean' options
 * @param {string} [options.cwd] Current working directory
 * @param {string} [options.bundle] Clean bundled build artifacts
 * @param {string} [options.minify] Clean minified build artifacts
 * @param {string} [options.typings] Clean typing artifacts
 * @param {string} [options.custom] Clean based on a user-defined pattern
 */
export async function clean (options = {}) {
  const {
    cwd = process.cwd(),
    bundle,
    minify,
    typings,
    custom
  } = options

  const cwdExists = await exists(cwd)
  if (!cwdExists) {
    console.error(`clean: ${cwd} No such file or directory`)
    process.exitCode = 1
    return
  }

  if (bundle) {
    await cleanCategory(cwd, bundle)
  }

  if (minify) {
    await cleanCategory(cwd, minify)
  }

  if (typings) {
    await cleanCategory(cwd, typings)
  }

  if (custom) {
    await cleanCategory(cwd, custom)
  }
}

/**
 * Clean one category of build artifacts
 * @private
 * @param {string} cwd the current working directory
 * @param {string} glob the pattern of files to match
 */
async function cleanCategory (cwd, glob) {
  const files = await match(glob, cwd, 'node_modules/**')
  await cleanAsync(files)
}

/**
 * Clean files/globs
 * @private
 * @param {string[]} files Files/globs to delete
 */
export async function cleanAsync (files) {
  try {
    for (const file of files) {
      await rm(file, { force: true })
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`clean: error ${error.message}`)
    } else {
      console.error(`Unexpected error: ${error}`)
    }
    process.exitCode = 1
  }
}
