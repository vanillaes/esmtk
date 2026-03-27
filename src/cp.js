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
    process.exit(1)
  }
  const sStats = await stat(source)
  if (sStats.isSymbolicLink()) {
    console.error(`cp: ${source} is a sybolic link (not copied)`)
    process.exit(1)
  }
  if (!sStats.isFile()) {
    console.error(`cp: ${source} is a directory (not copied)`)
    process.exit(1)
  }

  const tExists = await fileExists(target)
  const tIsDir = target.endsWith(sep)
  // copy file-to-directory
  if (tIsDir) {
    if (!tExists) {
      console.error(`cp: ${target} No such file or directory`)
      process.exit(1)
    }
    const tStats = await stat(target)
    if (tStats.isSymbolicLink()) {
      console.error(`cp: ${target} is a sybolic link (not copied)`)
      process.exit(1)
    }

    // append source file name to target directory
    const sourceFile = basename(source)
    target = target.endsWith(sep) ? target.slice(0, -1) : target
    target = `${target}${sep}${sourceFile}`
  }

  try {
    await cp(source, target, { force: true })
  } catch (err) {
    console.error(`cp: error ${err.message}`)
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
    process.exit(1)
  }
  const tStats = await stat(target)
  if (tStats.isSymbolicLink()) {
    console.error(`cp: ${target} is a sybolic link (not copied)`)
    process.exit(1)
  }

  try {
    target = target.endsWith(sep) ? target.slice(0, -1) : target
    for (const source of sources) {
      await cp(source, `${target}${sep}${basename(source)}`, { force: true })
    }
  } catch (err) {
    console.error(`cp": error ${err.message}`)
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
    process.exit(1)
  }
  const sStats = await stat(source)
  if (sStats.isSymbolicLink()) {
    console.error(`cp: ${source} is a sybolic link (not copied)`)
    process.exit(1)
  }

  const tExists = await fileExists(target)
  if (!tExists) {
    console.error(`cp: ${target} No such file or directory`)
    process.exit(1)
  }
  const tStats = await stat(target)
  if (tStats.isSymbolicLink()) {
    console.error(`cp: ${target} is a sybolic link (not copied)`)
    process.exit(1)
  }
  if (!tStats.isDirectory()) {
    console.error(`cp: target ${target} Not a directory`)
    process.exit(1)
  }

  try {
    await cp(source, target, { force: true, recursive: true })
  } catch (err) {
    console.error(`cp": error ${err.message}`)
  }
}
