import { runScript } from './index.js'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

/**
 * @typedef {object} RawPackage
 * @property {string|undefined} [name] Name
 * @property {string|undefined} [version] Version
 * @property {string|undefined} [description] Description
 * @property {string[]|undefined} [keywords] Keywords
 * @property {string|undefined} [repository] Repository
 * @property {string|undefined} [author] Author
 * @property {string|undefined} [license] License
 * @property {string|undefined} [type] Type
 * @property {{[key: string]: {[key: string]: string}}|undefined} [bin] Binaries
 * @property {{[key: string]: {[key: string]: string}}|undefined} [exports] Exports
 * @property {{[key: string]: {[key: string]: string}}|undefined} [scripts] Scripts
 * @property {object|undefined} [engines] Engines
 * @property {object|undefined} [dependencies] Dependencies
 * @property {object|undefined} [devDependencies] DevDependencies
 */

/**
 * package.json
 */
export class Package {
  /**
   * @type {string}
   */
  #cwd = process.cwd()

  /**
   * @type {string}
   */
  #raw = ''

  /**
   * @type {RawPackage}
   */
  contents = {}

  /**
   * @type {Package}
   */
  static #instance

  /**
   * @param {string} [cwd] Current working directory
   */
  constructor (cwd) {
    // memoize that shit using a singleton
    if (Package.#instance) {
      return Package.#instance
    }

    if (cwd) {
      this.#cwd = cwd
    }

    this.refresh()

    Package.#instance = this
  }

  /**
   * Name
   * @type {string|undefined}
   */
  get name () {
    return this.contents.name
  }

  /**
   * Name
   * @param {string} name Name
   */
  set name (name) {
    this.contents.name = name
  }

  /**
   * Version
   * @type {string|undefined}
   */
  get version () {
    return this.contents.version
  }

  /**
   * Version
   * @param {string} version Version
   */
  set version (version) {
    this.contents.version = version
  }

  /**
   * Description
   * @type {string|undefined}
   */
  get description () {
    return this.contents.description
  }

  /**
   * Keywords
   * @type {string[]|undefined}
   */
  get keywords () {
    return this.contents.keywords
  }

  /**
   * Repository
   * @type {string|undefined}
   */
  get repository () {
    return this.contents.repository
  }

  /**
   * Author
   * @type {string|undefined}
   */
  get author () {
    return this.contents.author
  }

  /**
   * License
   * @type {string|undefined}
   */
  get license () {
    return this.contents.license
  }

  /**
   * Type
   * @type {string|undefined}
   */
  get type () {
    return this.contents.type
  }

  /**
   * Bin
   * @type {{[key: string]: {[key: string]: string}}|undefined}
   */
  get bin () {
    return this.contents.bin
  }

  /**
   * Exports
   * @type {{[key: string]: {[key: string]: string}}|undefined}
   */
  get exports () {
    return this.contents.exports
  }

  /**
   * Scripts
   * @type {{[key: string]: {[key: string]: string}}|undefined}
   */
  get scripts () {
    return this.contents.scripts
  }

  /**
   * Engines
   * @type {object|undefined}
   */
  get engines () {
    return this.contents.engines
  }

  /**
   * Dependencies
   * @type {object|undefined}
   */
  get dependencies () {
    return this.contents.dependencies
  }

  /**
   * devDependencies
   * @type {object|undefined}
   */
  get devDependencies () {
    return this.contents.devDependencies
  }

  /**
   * Refresh package.json contents
   */
  refresh () {
    const path = join(this.#cwd, 'package.json')
    if (!existsSync(path)) {
      return
    }

    try {
      this.#raw = readFileSync(path, 'utf8')
    } catch (error) {
      throw new Error(`Faled to read package.json\n${error}`)
    }

    try {
      this.contents = JSON.parse(this.#raw)
    } catch (error) {
      throw new Error(`Invalid package.json\n${error}`)
    }
  }

  /**
   * Run a 'package.json' script
   * @param {string} name Script name
   * @returns {Promise<number>} Script exit Code
   */
  async runScript (name) {
    if (!this.scripts?.[name]) {
      return 0
    }
    return await runScript(name)
  }

  /**
   * Resolve the 'exports' field
   * @returns {string} Default entry-point
   */
  resolve () {
    if (!this.exports) {
      throw new Error('No exports field found')
    }
    if (this.type === 'module') {
      if (this.exports['.']?.default) {
        return resolve(`${this.exports['.'].default}`)
      }
      if (this.exports['.']?.import) {
        return resolve(`${this.exports['.'].import}`)
      }
      if (this.exports['.']) {
        return resolve(`${this.exports['.']}`)
      }
      if (this.exports?.import) {
        return resolve(`${this.exports?.import}`)
      }
    }
    throw new Error('Package could not be resolved')
  }

  /**
   * Save package.json contents
   */
  save () {
    const path = join(this.#cwd, 'package.json')
    try {
      const trailingNewline = this.#raw.endsWith('\n') ? '\n' : ''
      writeFileSync(path, JSON.stringify(this.contents, null, 2) + trailingNewline)
    } catch (error) {
      throw new Error(`Failed to write package.json\n${error}`)
    }
  }
}
