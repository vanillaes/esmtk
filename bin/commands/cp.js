import { copyAsync, copyRecursiveAsync } from '../../src/cp.js'

export async function cp (source, target, options) {
  if (!options?.recursive) {
    await copyAsync(source, target, options?.force)
  }

  if (options?.recursive) {
    await copyRecursiveAsync(source, target, options?.force)
  }
}
