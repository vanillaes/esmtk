import { removeAsync, removeRecursiveAsync } from '../../src/rm.js'

export async function rm (path, options) {
  if (!options?.recursive) {
    await removeAsync(path, options?.force)
  }

  if (options?.recursive) {
    await removeRecursiveAsync(path, options?.force)
  }
}
