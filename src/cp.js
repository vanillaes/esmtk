import { fileExists } from './index.js'
import { basename, sep } from 'node:path'
import { cp, stat } from 'node:fs/promises'

/**
 * Copy a single file asynchronously
 * @param {string} source The source file
 * @param {string} target The target file
 * @param {boolean} force If the file already exists, overwrite it (default false)
 */
export async function copyAsync (source, target, force = false) {
  const sExists = await fileExists(source)
  if (!sExists) {
    console.error(`cp: ${source} No such file or directory`)
    process.exitCode = 1
    return
  }
  const sStats = await stat(source)
  if (sStats.isSymbolicLink()) {
    console.error(`cp: ${source} is a sybolic link (not copied)`)
    process.exitCode = 1
    return
  }
  if (!sStats.isFile()) {
    console.error(`cp: ${source} is a directory (not copied)`)
    process.exitCode = 1
    return
  }

  const tExists = await fileExists(target)
  const tIsDir = target.endsWith(sep)
  // copy file-to-directory
  if (tIsDir) {
    if (!tExists) {
      console.error(`cp: ${target} No such file or directory`)
      process.exitCode = 1
      return
    }
    const tStats = await stat(target)
    if (tStats.isSymbolicLink()) {
      console.error(`cp: ${target} is a sybolic link (not copied)`)
      process.exitCode = 1
      return
    }

    // append source file name to target directory
    const sourceFile = basename(source)
    target = target.endsWith(sep) ? target.slice(0, -1) : target
    target = `${target}${sep}${sourceFile}`
  }

  try {
    await cp(source, target, { force: true })
  } catch (error) {
    if (error instanceof Error) {
      console.error(`cp: error ${error.message}`)
    } else {
      console.error(`Unexpected error: ${error}`)
    }
    process.exitCode = 1
  }
}

/**
 * Copy a multiple files/globs asynchronously
 * @param {string[]} sources The source files/globs
 * @param {string} target The target file
 * @param {boolean} force If the file already exists, overwrite it (default false)
 */
export async function copyMultipleAsync (sources, target, force = false) {
  const tExists = await fileExists(target)
  if (!tExists) {
    console.error(`cp: ${target} No such file or directory`)
    process.exitCode = 1
    return
  }
  const tStats = await stat(target)
  if (tStats.isSymbolicLink()) {
    console.error(`cp: ${target} is a sybolic link (not copied)`)
    process.exitCode = 1
    return
  }

  try {
    target = target.endsWith(sep) ? target.slice(0, -1) : target
    for (const source of sources) {
      await cp(source, `${target}${sep}${basename(source)}`, { force: true })
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`cp: error ${error.message}`)
    } else {
      console.error(`Unexpected error: ${error}`)
    }
    process.exitCode = 1
  }
}

/**
 * Recursively copy a directory asynchronously
 * @param {string} source The source directory
 * @param {string} target The target directory
 * @param {boolean} force If the file already exists, overwrite it (default false)
 */
export async function copyRecursiveAsync (source, target, force = false) {
  const sExists = await fileExists(source)
  if (!sExists) {
    console.error(`cp: ${source} No such file or directory`)
    process.exitCode = 1
    return
  }
  const sStats = await stat(source)
  if (sStats.isSymbolicLink()) {
    console.error(`cp: ${source} is a sybolic link (not copied)`)
    process.exitCode = 1
    return
  }

  const tExists = await fileExists(target)
  if (!tExists) {
    console.error(`cp: ${target} No such file or directory`)
    process.exitCode = 1
    return
  }
  const tStats = await stat(target)
  if (tStats.isSymbolicLink()) {
    console.error(`cp: ${target} is a sybolic link (not copied)`)
    process.exitCode = 1
    return
  }
  if (!tStats.isDirectory()) {
    console.error(`cp: target ${target} Not a directory`)
    process.exitCode = 1
    return
  }

  try {
    await cp(source, target, { force: true, recursive: true })
  } catch (error) {
    if (error instanceof Error) {
      console.error(`cp: error ${error.message}`)
    } else {
      console.error(`Unexpected error: ${error}`)
    }
    process.exitCode = 1
  }
}
