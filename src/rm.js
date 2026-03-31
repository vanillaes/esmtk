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
    process.exitCode = 1
    return
  }
  const stats = await stat(path)
  if (stats.isSymbolicLink()) {
    console.error(`rm: ${path} is a sybolic link`)
    process.exitCode = 1
    return
  }
  if (!stats.isFile()) {
    console.error(`rm: ${path} is a directory`)
    process.exitCode = 1
    return
  }

  try {
    await rm(path, { force: true })
  } catch (error) {
    console.error(`rm: error ${error.message}`)
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
  } catch (error) {
    console.error(`cp": error ${error.message}`)
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
    process.exitCode = 1
    return
  }
  const stats = await stat(path)
  if (stats.isSymbolicLink()) {
    console.error(`rm: ${path} is a sybolic link`)
    process.exitCode = 1
    return
  }

  try {
    await rm(path, { force: true, recursive: true })
  } catch (error) {
    console.error(`rm": error ${error.message}`)
  }
}
