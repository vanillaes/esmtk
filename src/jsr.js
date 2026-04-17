import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

/**
 * @typedef {object} RawJSR
 * @property {string|undefined} [name] Name
 * @property {string|undefined} [version] Version
 * @property {string|undefined} [license] License
 * @property {{[key: string]: {[key: string]: string}}|undefined} [exports] Exports
 * @property {{[key: string]: {[key: string]: string}}|undefined} [publish] Publish
 */

/**
 * jsr.json
 */
export class JSR {
  /**
   * @type {string}
   */
  #cwd = process.cwd()

  /**
   * @type {string}
   */
  #raw = ''

  /**
   * @type {RawJSR}
   */
  #contents = {}

  /**
   * @type {JSR}
   */
  static #instance

  /**
   * @param {string} [cwd] Current working directory
   */
  constructor (cwd) {
    // memoize that shit using a singleton
    if (JSR.#instance) {
      return JSR.#instance
    }

    if (cwd) {
      this.#cwd = cwd
    }

    this.refresh()

    return this
  }

  /**
   * Name
   * @type {string|undefined}
   */
  get name () {
    return this.#contents.name
  }

  /**
   * Name
   * @param {string} name Name
   */
  set name (name) {
    this.#contents.name = name
  }

  /**
   * Version
   * @type {string|undefined}
   */
  get version () {
    return this.#contents.version
  }

  /**
   * Version
   * @param {string} version Version
   */
  set version (version) {
    this.#contents.version = version
  }

  /**
   * License
   * @type {string|undefined}
   */
  get license () {
    return this.#contents.license
  }

  /**
   * Exports
   * @type {{[key: string]: {[key: string]: string}}|undefined}
   */
  get exports () {
    return this.#contents.exports
  }

  /**
   * Publish
   * @type {{[key: string]: {[key: string]: string}}|undefined}
   */
  get publish () {
    return this.#contents.exports
  }

  /**
   * Refresh package.json contents
   */
  refresh () {
    const path = join(this.#cwd, 'jsr.json')
    if (!existsSync(path)) {
      return
    }

    try {
      this.#raw = readFileSync(path, 'utf8')
    } catch (error) {
      throw new Error(`Faled to read jsr.json\n${error}`)
    }

    try {
      this.#contents = JSON.parse(this.#raw)
    } catch (error) {
      throw new Error(`Invalid jsr.json\n${error}`)
    }

    JSR.#instance = this
  }

  /**
   * Resolve the 'exports' field
   * @returns {string} Default entry-point
   */
  resolve () {
    if (!this.exports) {
      throw new Error('No exports field found')
    }
    if (this.exports['.']) {
      return resolve(`${this.exports['.']}`)
    }
    throw new Error('JSR export could not be resolved')
  }

  /**
   * Save package.json contents
   */
  save () {
    const path = join(this.#cwd, 'jsr.json')
    try {
      const trailingNewline = this.#raw.endsWith('\n') ? '\n' : ''
      writeFileSync(path, JSON.stringify(this.#contents, null, 2) + trailingNewline)
    } catch (error) {
      throw new Error(`Failed to write jsr.json\n${error}`)
    }
  }
}
