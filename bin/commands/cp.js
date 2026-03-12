import { copyAsync, copyRecursiveAsync } from '../../src/cp.js'

/**
 * POSIX cp Implemented in Node
 * @param {string} path path of file(s)/directorie(s) to copy
 * @param {any} options cp options
 */
export async function cp (source, target, options) {
  if (!options?.recursive) {
    await copyAsync(source, target, options?.force)
  }

  if (options?.recursive) {
    await copyRecursiveAsync(source, target, options?.force)
  }
}
