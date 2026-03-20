import { removeAsync, removeMultipleAsync, removeRecursiveAsync } from '../../src/rm.js'
import { expandSource } from '../../src/util.js'

/**
 * POSIX rm Implemented in Node
 * @param {string[]} paths Variadic of file paths
 * @param {any} options rm options
 */
export async function rm (paths, options) {
  if (paths.length === 1) {
    if (!options?.recursive && !paths[0].includes('*')) {
      const file = paths[0]
      await removeAsync(file, options?.force)
    }

    if (options?.recursive) {
      const directory = paths[0]
      await removeRecursiveAsync(directory, options?.force)
    }

    if (paths[0].includes('*')) {
      const glob = paths[0]
      const files = await expandSource(glob)
      await removeMultipleAsync(files, options?.force)
    }
  }

  if (paths.length > 1) {
    let files = await await Promise.all(paths.map(path => expandSource(path)))
    files = files.flat()

    await removeMultipleAsync(files, options?.force)
  }
}
