import { gitSync } from './utils.js'

export class Repository {
  /** @type { string } */
  static cwd = process.cwd()

  constructor () {
    throw new Error('Repository is a static class and cannot be instantiated')
  }

  /**
   * ClassName
   * @type {string}
   */
  get [Symbol.toStringTag] () {
    return 'Repository'
  }

  /**
   * Git add/stage the following files
   * @param {string[]} files Files to add
   * @param {string} [cwd] Current Working Directory
   * @returns {string} Returns stdout/stderr output
   */
  static add (files, cwd = Repository.cwd) {
    return gitSync(`add ${files.join(' ')}`, cwd)
  }

  /**
   * Git commit
   * @param {string} message Commit message
   * @param {string} [cwd] Current working directory
   * @returns {string} Returns stdout/stderr output
   */
  static commit (message, cwd = Repository.cwd) {
    return gitSync(`commit -m ${message}`, cwd)
  }

  /**
   * Is the git working tree clean of uncommitted changes?
   * @param {string} [cwd] Current working directory
   * @returns {boolean} Returns true if the working tree is clean, otherwise false
   */
  static isWorkingTreeClean (cwd = Repository.cwd) {
    const out = gitSync('status --porcelain', cwd)
    return out.length === 0
  }

  /**
   * Git latest release tag
   * @param {string} [cwd] Current working directory
   * @returns {string} Latest release tag (default v0.0.0)
   */
  static latestRelease (cwd = Repository.cwd) {
    const tag = gitSync('describe --match "v*" --abbrev=0 --tags $(git rev-list --tags --max-count=1)', cwd) || 'v0.0.0'
    const cleaned = tag.replace(/^v/, '')
    return cleaned
  }

  /**
   * Git origin URL
   * @param {string} [cwd] Current working directory
   * @returns {string} the repository name
   */
  static url (cwd = Repository.cwd) {
    try {
      let origin = gitSync('remote get-url origin', cwd)
      if (origin.startsWith('git@github.com:')) {
        origin = origin.replace('git@github.com:', 'https://github.com/')
      }
      if (origin.endsWith('.git')) {
        origin = origin.slice(0, -4)
      }
      return origin
    } catch {
      return ''
    }
  }

  /**
   * Git tag
   * @param {string} release Release version
   * @param {string} message Commit message
   * @param {string} cwd Current working directory
   * @returns {string} Returns stdout/stderr output
   */
  static tag (release, message, cwd = Repository.cwd) {
    return gitSync(`tag -a v${release} -m ${message}`, cwd)
  }
}
