import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * @typedef {object} RawPackage
 * @property {string|undefined} [name] Name
 * @property {string|undefined} [version] Version
 * @property {{[key: string]: {[key: string]: string}}|undefined} [packages] Packages
 */

/**
 * package-lock.json
 */
export class PackageLock {
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
  #contents = {}

  /**
   * @type {PackageLock}
   */
  static #instance

  /**
   * @param {string} [cwd] Current working directory
   */
  constructor (cwd) {
    // memoize that shit using a singleton
    if (PackageLock.#instance) {
      return PackageLock.#instance
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
   * @param {string} version Version
   */
  set version (version) {
    this.#contents.version = version
    if (this.packages?.['']) {
      this.packages[''].version = version
    }
  }

  /**
   * Packages
   * @type {{[key: string]: {[key: string]: string}|undefined}|undefined}
   */
  get packages () {
    return this.#contents.packages
  }

  /**
   * Refresh package.json contents
   */
  refresh () {
    const path = join(this.#cwd, 'package-lock.json')
    if (!existsSync(path)) {
      return
    }

    try {
      this.#raw = readFileSync(path, 'utf8')
    } catch (error) {
      throw new Error(`Faled to read package.json\n${error}`)
    }

    try {
      this.#contents = JSON.parse(this.#raw)
    } catch (error) {
      throw new Error(`Invalid package-lock.json\n${error}`)
    }

    PackageLock.#instance = this
  }

  /**
   * Save package-lock.json contents
   */
  save () {
    const path = join(this.#cwd, 'package-lock.json')
    try {
      const trailingNewline = this.#raw.endsWith('\n') ? '\n' : ''
      writeFileSync(path, JSON.stringify(this.#contents, null, 2) + trailingNewline)
    } catch (error) {
      throw new Error(`Failed to write package-lock.json\n${error}`)
    }
  }
}
