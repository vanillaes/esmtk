import { access, constants, rm, stat } from 'node:fs/promises'

/**
 * Remove a file asynchronously
 * @param {string} path The file to delete
 * @param {boolean} force Ignore exceptions if the file doesn't exist (default false)
 */
export async function removeAsync (path, force = false) {
  const exists = await fileExists(path)
  if (!exists) {
    console.error(`rm: path ${path} does not exist`)
    process.exit(1)
  }
  const stats = await stat(path)
  if (stats.isSymbolicLink()) {
    console.error(`rm: path ${path} is a sybolic link`)
    process.exit(1)
  }

  try {
    await rm(path, { force })
  } catch (err) {
    console.error(`rm: error ${err.message}`)
  }
}

/**
 * Recursively remove a file|directory asynchronously
 * @param {string} path The file|directory to remove
 * @param {bool} force Ignore exceptions if the file|directory doesn't exist (default false)
 */
export async function removeRecursiveAsync (path, force = false) {
  const exists = await fileExists(path)
  if (!exists) {
    console.error(`rm: path ${path} does not exist`)
    process.exit(1)
  }
  const stats = await stat(path)
  if (stats.isSymbolicLink()) {
    console.error(`rm: path ${path} is a sybolic link`)
    process.exit(1)
  }

  try {
    await rm(path, { force, recursive: true })
  } catch (err) {
    console.error(`rm": error ${err.message}`)
  }
}

async function fileExists (file) {
  try {
    await access(file, constants.F_OK)
    return true
  } catch (error) {
    return false
  }
}
