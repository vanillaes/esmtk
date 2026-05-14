import { exists } from '../util.js'
import { execSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Get the user.email from git
 * @returns {string} the user.email
 */
export function gitUserEmail () {
  try {
    return gitSync('config --global user.email')
  } catch (err) {
    return ''
  }
}

/**
 * Get the user.name from git
 * @returns {string} the user.name
 */
export function gitUserName () {
  try {
    return gitSync('config --global user.name')
  } catch {
    return ''
  }
}

/**
 * Run a git command, returning stdout (trimmed). Throws on non-zero exit.
 * @param {string} args Arguments
 * @param {string} [cwd] Current working directory
 * @returns {string} Returns stdout/stderr output
 */
export function gitSync (args, cwd = process.cwd()) {
  return execSync(`git ${args}`, { cwd, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim()
}

/**
 * Is this a git repository?
 * @private
 * @param {string} [cwd] Current working directory
 * @returns {boolean} Returns true if this package is a git repo, otherwise false.
 */
export function isGitRepo (cwd = process.cwd()) {
  try {
    gitSync('rev-parse --is-inside-work-tree')
    return true
  } catch {
    return false
  }
}

/**
 * Read .gitignore
 * @param {string} [cwd] Current working directory
 * @returns {Promise<string[]>} Comma-deliminated list of ignore globs
 */
export async function readGitIgnore (cwd = process.cwd()) {
  const path = join(cwd, '.gitignore')
  const cwdExists = await exists(path)
  if (!cwdExists) {
    return []
  }
  const contents = await readFile(path, 'utf8')
  return contents
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
}
