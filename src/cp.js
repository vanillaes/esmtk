import { basename, dirname } from 'node:path'
import { access, constants, cp, stat } from 'node:fs/promises'

/**
 * Copy a single file asynchronously
 * @param {string} source The source file
 * @param {string} target The target file
 * @param {boolean} force If the file already exists, overwrite it (default false)
 */
export async function copyAsync (source, target, force = false) {
  const sExists = await fileExists(source)
  if (!sExists) {
    console.error(`cp: source ${source} does not exist`)
    process.exit(1)
  }
  const sStats = await stat(source)
  if (sStats.isSymbolicLink()) {
    console.error(`cp: source ${source} is a sybolic link`)
    process.exit(1)
  }

  const tDir = dirname(target)
  const tDirExists = await fileExists(tDir)
  if (!tDirExists) {
    console.error(`cp: target directory ${tDir} does not exist`)
    process.exit(1)
  }

  const tExists = await fileExists(target)
  if (tExists) {
    const tStats = await stat(target)
    if (tStats.isSymbolicLink()) {
      console.error(`cp: target ${target} is a sybolic link`)
      process.exit(1)
    }
    if (tStats.isDirectory()) {
      const sourceFile = basename(source)
      target = target.endsWith('/') ? target.slice(0, -1) : target
      target = `${target}/${sourceFile}`
    }
  }

  try {
    await cp(source, target, { force })
  } catch (err) {
    console.error(`cp: error ${err.message}`)
  }
}

/**
 * Recursively copy a directory asynchronously
 * @param {string} source The source directory
 * @param {string} target The target directory
 * @param {bool} force If the file already exists, overwrite it (default false)
 */
export async function copyRecursiveAsync (source, target, force = false) {
  const sExists = await fileExists(source)
  if (!sExists) {
    console.error(`cp: source ${source} does not exist`)
    process.exit(1)
  }
  const sStats = await stat(source)
  if (sStats.isSymbolicLink()) {
    console.error(`cp: source ${source} is a sybolic link`)
    process.exit(1)
  }

  const tExists = await fileExists(target)
  if (!tExists) {
    console.error(`cp: target directory ${target} does not exist`)
    process.exit(1)
  }
  const tStats = await stat(target)
  if (tStats.isSymbolicLink()) {
    console.error(`cp: target ${target} is a sybolic link`)
    process.exit(1)
  }
  if (!tStats.isDirectory()) {
    console.error(`cp: target ${target} is not a directory`)
    process.exit(1)
  }

  try {
    await cp(source, target, { force, recursive: true })
  } catch (err) {
    console.error(`cp": error ${err.message}`)
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
