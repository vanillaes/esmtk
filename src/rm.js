import { fileExists } from './index.js'
import { rm, stat } from 'node:fs/promises'

/**
 * Remove a file asynchronously
 * @param {string} path The file to delete
 * @param {boolean} force Ignore exceptions if the file doesn't exist (default false)
 */
export async function removeAsync (path, force = false) {
  const exists = await fileExists(path)
  if (!exists) {
    console.error(`rm: ${path} No such file or directory`)
    process.exit(1)
  }
  const stats = await stat(path)
  if (stats.isSymbolicLink()) {
    console.error(`rm: ${path} is a sybolic link`)
    process.exit(1)
  }
  if (!stats.isFile()) {
    console.error(`rm: ${path} is a directory`)
    process.exit(1)
  }

  try {
    await rm(path, { force: true })
  } catch (err) {
    console.error(`rm: error ${err.message}`)
  }
}

/**
 * Remove a multiple files/globs asynchronously
 * @param {string[]} files The files/globs to delete
 * @param {boolean} force If the file already exists, overwrite it (default false)
 */
export async function removeMultipleAsync (files, force = false) {
  try {
    for (const file of files) {
      await rm(file, { force: true })
    }
  } catch (err) {
    console.error(`cp": error ${err.message}`)
  }
}

/**
 * Recursively remove a file|directory asynchronously
 * @param {string} path The file|directory to remove
 * @param {boolean} force Ignore exceptions if the file|directory doesn't exist (default false)
 */
export async function removeRecursiveAsync (path, force = false) {
  const exists = await fileExists(path)
  if (!exists) {
    console.error(`rm: ${path} No such file or directory`)
    process.exit(1)
  }
  const stats = await stat(path)
  if (stats.isSymbolicLink()) {
    console.error(`rm: ${path} is a sybolic link`)
    process.exit(1)
  }

  try {
    await rm(path, { force: true, recursive: true })
  } catch (err) {
    console.error(`rm": error ${err.message}`)
  }
}
