import { removeAsync, removeMultipleAsync, removeRecursiveAsync } from '../../src/rm.js'
import { expand } from '../../src/util.js'

/**
 * POSIX rm Implemented in Node
 * @param {string[]} paths Variadic of file paths
 * @param {object} options 'rm' options
 * @param {boolean} options.force Do not prompt before overwriting
 * @param {boolean} options.recursive Copy file(s)/directorie(s) recursively
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
      const files = await expand(glob)
      await removeMultipleAsync(files, options?.force)
    }
  }

  if (paths.length > 1) {
    const files = await await Promise.all(paths.map(path => expand(path)))
    const flatFiles = files.flat()

    await removeMultipleAsync(flatFiles, options?.force)
  }
}
