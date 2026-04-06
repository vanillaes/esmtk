import { match, readNPMIgnore } from '../../src/util.js'
import { statSync } from 'node:fs'
import { dirname, join } from 'node:path'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

/**
 * @typedef Options
 * @property {string} cwd Current working directory
 */

/**
 * Preview the package contents included during 'npm publish'
 * @param {Options} options 'preview' options
 */
export async function preview (options) {
  let ignore = await readNPMIgnore(options.cwd)
  ignore = `${ignore},node_modules/,package-lock.json`

  let files = await match('**/*', options.cwd, ignore)
  if (files.length === 0) {
    console.log('preview: no files found')
    return
  }
  files = files
    .filter(path => statSync(path).isFile())
    .sort((a, b) => fileCompare(a, b))

  const pkg = require(join(options.cwd, 'package.json'))

  console.log()
  console.log(`📦  ${pkg.name}@${pkg.version}`)
  for (const file of files) {
    console.log(formatFile(file))
  }
  console.log()
}

/**
 * File list comparator
 * @private
 * @param {string} a file path a
 * @param {string} b file path b
 * @returns {number} 1 | -1
 */
function fileCompare (a, b) {
  const dirA = dirname(a)
  const dirB = dirname(b)
  if (dirA !== '.' && dirB === '.') {
    return -1
  }
  if (dirA === '.' && dirB !== '.') {
    return 1
  }
  return a.localeCompare(b)
}

/**
 * Format a file path to include file size
 * @private
 * @param {string} path the file path
 * @returns {string} file size followed by file path
 */
function formatFile (path) {
  const size = statSync(path).size
  if (size > (1024 * 1024)) {
    const megabytes = (size / (1024 * 1024)).toLocaleString('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      roundingMode: 'trunc'
    })
    return `${megabytes} MB`.padEnd(10) + `${path}`
  }
  if (size > 1024) {
    const kilobytes = (size / 1024).toLocaleString('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      roundingMode: 'trunc'
    })
    return `${kilobytes} KB`.padEnd(10) + `${path}`
  }
  return `${size} B`.padEnd(10) + `${path}`
}
