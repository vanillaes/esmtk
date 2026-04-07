import { fileExists } from './index.js'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * @typedef {object} PackageJSON
 * @property {string} [name] name
 * @property {string} [version] version
 * @property {string} [description] description
 * @property {Array<string>} [keywords] keywords
 * @property {string} [repository] repository
 * @property {string} [author] author
 * @property {string} [license] license
 * @property {string} [type] type
 * @property {object} [bin] bin
 * @property {object} [exports] exports
 * @property {object} [scripts] scripts
 * @property {object} [engines] engines
 * @property {object} [dependencies] dependencies
 * @property {object} [devDependencies] devDependencies
 */

/**
 * Read package.json
 * @param {string} cwd the current working directory
 * @returns {Promise<PackageJSON>} the contents of package.json
 */
export async function readPackageJSON (cwd = process.cwd()) {
  const path = join(cwd, 'package.json')
  const exists = await fileExists(path)
  if (!exists) {
    throw new Error('package.json not found')
  }
  const contents = await readFile(path, 'utf8')
  return JSON.parse(contents)
}
