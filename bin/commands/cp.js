import { copyAsync, copyMultipleAsync, copyRecursiveAsync } from '../../src/cp.js'
import { expand } from '../../src/index.js'

/**
 * POSIX cp Implemented in Node
 * @param {string[]} paths Variadic of source/destination paths
 * @param {object} options 'cp' options
 */
export async function cp (paths, options) {
  if (paths.length < 2) {
    console.error('cp: Not enough arguments')
    process.exitCode = 1
    return
  }

  if (paths.length === 2) {
    const source = paths[0]
    const target = paths[1]

    if (!options?.recursive && !source.includes('*')) {
      await copyAsync(source, target, options?.force)
    }

    if (options?.recursive) {
      await copyRecursiveAsync(source, target, options?.force)
    }

    if (source.includes('*')) {
      const sources = await expand(source)
      await copyMultipleAsync(sources, target, options?.force)
    }
  }

  if (paths.length > 2) {
    const sourcePatterns = paths.slice(0, -1)
    const sourceFiles = await await Promise.all(sourcePatterns.map(source => expand(source)))
    const sources = sourceFiles.flat()
    const target = paths.slice(-1)[0]

    await copyMultipleAsync(sources, target, options?.force)
  }
}
