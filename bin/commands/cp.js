import { copyAsync, copyRecursiveAsync } from '../../src/cp.js'

/**
 * POSIX cp Implemented in Node
 * @param {string[]} paths variadic of source/destination paths
 * @param {any} options cp options
 */
export async function cp (paths, options) {
  if (paths.length < 2) {
    console.error('cp: Not enough arguments')
  }

  if (paths.length == 2) {
    const source = paths[0]
    const target = paths[1]

    if (!options?.recursive) {
      await copyAsync(source, target, options?.force)
    }

    if (options?.recursive) {
      await copyRecursiveAsync(source, target, options?.force)
    }
  }
}
