import { removeAsync, removeRecursiveAsync } from '../../src/rm.js'

/**
 * POSIX rm Implemented in Node
 * @param {string} path path of file(s)/directorie(s) to remove
 * @param {any} options rm options
 */
export async function rm (path, options) {
  if (!options?.recursive) {
    await removeAsync(path, options?.force)
  }

  if (options?.recursive) {
    await removeRecursiveAsync(path, options?.force)
  }
}
