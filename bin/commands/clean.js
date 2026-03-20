import { removeMultipleAsync } from '../../src/rm.js'
import { fileExists, match } from '../../src/util.js'

/**
 * Clean build artifcats using sensible defaults
 * @param {string} root the root directory
 * @param {any} options clean options
 */
export async function clean (root, options) {
  const exists = await fileExists(root)
  if (!exists) {
    console.error(`clean: ${root} No such file or directory`)
    process.exit(1)
  }

  if (options?.bundle) {
    await cleanOne(root, options.bundle, options)
  }

  if (options?.minify) {
    await cleanOne(root, options.minify, options)
  }

  if (options?.typings) {
    await cleanOne(root, options.typings, options)
  }

  if (options?.custom) {
    await cleanOne(root, options.custom, options)
  }
}

async function cleanOne (root, glob, options) {
  const files = await match(glob, root, 'node_modules/**')
  await removeMultipleAsync(files, options?.force)
}
