import { execSync } from 'node:child_process'

/**
 * Git add/stage the following files
 * @param {string[]} files Files to add
 * @param {string} [cwd] Current Working Directory
 * @returns {string} Returns stdout/stderr output
 */
export function gitAdd (files, cwd = process.cwd()) {
  return git(`add ${files.join(' ')}`)
}

/**
 * Git commit
 * @param {string} message Commit message
 * @param {string} [cwd] Current working directory
 * @returns {string} Returns stdout/stderr output
 */
export function gitCommit (message, cwd = process.cwd()) {
  return git(`commit -m ${message}`)
}

/**
 * Git latest release tag
 * @param {string} [cwd] Current working directory
 * @returns {string} Latest release tag (default v0.0.0)
 */
export function gitLatestRelease (cwd) {
  const tag = git('describe --match "v*" --abbrev=0 --tags $(git rev-list --tags --max-count=1)') || 'v0.0.0'
  return tag.substring(1)
}

/**
 * Git tag
 * @param {string} release Release version
 * @param {string} message Commit message
 * @param {string} cwd Current working directory
 * @returns {string} Returns stdout/stderr output
 */
export function gitTag (release, message, cwd = process.cwd()) {
  return git(`tag -a v${release} -m ${message}`)
}

/**
 * Is this a git repository?
 * @private
 * @param {string} [cwd] Current working directory
 * @returns {boolean} Returns true if this package is a git repo, otherwise false.
 */
export function isGitRepo (cwd = process.cwd()) {
  try {
    git('rev-parse --is-inside-work-tree')
    return true
  } catch {
    return false
  }
}

/**
 * Is the git working tree clean of uncommitted changes?
 * @param {string} [cwd] Current working directory
 * @returns {boolean} Returns true if the working tree is clean, otherwise false
 */
export function isGitWorkingTreeClean (cwd = process.cwd()) {
  const out = git('status --porcelain')
  return out.length === 0
}

/**
 * Run a git command, returning stdout (trimmed). Throws on non-zero exit.
 * @private
 * @param {string} args Arguments
 * @param {string} [cwd] Current working directory
 * @returns {string} Returns stdout/stderr output
 */
function git (args, cwd = process.cwd()) {
  return execSync(`git ${args}`, { cwd, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim()
}
