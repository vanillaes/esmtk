import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

/**
 * package.json
 */
export class Package {
  /**
   * Name
   * @type {string}
   */
  name = ''

  /**
   * Version
   * @type {string}
   */
  version = ''

  /**
   * Description
   * @type {string}
   */
  description = ''

  /**
   * Keywords
   * @type {string[]}
   */
  keywords = []

  /**
   * Repository
   * @type {string}
   */
  repository = ''

  /**
   * Author
   * @type {string}
   */
  author = ''

  /**
   * License
   * @type {string}
   */
  license = ''

  /**
   * Type
   * @type {string}
   */
  type = ''

  /**
   * Bin
   * @type {object}
   */
  bin = {}

  /**
   * Exports
   * @type {{[key: string]: {[key: string]: string}}}
   */
  exports = {}

  /**
   * Engines
   * @type {object}
   */
  engines = {}

  /**
   * Dependencies
   * @type {object}
   */
  dependencies = {}

  /**
   * devDependencies
   * @type {object}
   */
  devDependencies = {}

  /**
   * @type {Package}
   */
  static #instance

  constructor () {
    // memoize that shit using a singleton
    if (Package.#instance) {
      return Package.#instance
    }

    this.refresh()

    return this
  }

  /**
   * Refresh package.json contents
   */
  refresh () {
    const path = join(process.cwd(), 'package.json')
    if (!existsSync(path)) {
      return
    }
    const contents = JSON.parse(readFileSync(path, 'utf8'))
    Object.assign(this, contents)

    Package.#instance = this
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
}
