import { Package } from './package.js'
import { execSync, spawn } from 'node:child_process'
import { join, resolve, delimiter } from 'node:path'
import { readFile } from 'node:fs/promises'
import { execAsync } from '../util.js'

/**
 * Check to see if a NPM package is installed globally
 * @param {string} pkg Package name
 * @returns {Promise<boolean>} True if the package is installed, false otherwise
 */
export async function installed (pkg) {
  try {
    await execAsync(`npm list -g --depth=0 ${pkg}`)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Locate the local npm package directory
 * @param {string} [cwd] Current working directory
 * @returns {string} The local npm bin directory
 */
export function localBin (cwd = process.cwd()) {
  return resolve(cwd, 'node_modules', '.bin')
}

/**
 * Locate the global npm package directory
 * @returns {string} The global npm bin
 */
export function globalBin () {
  const prefix = npmSync('config get prefix -g').toString().trim()
  return `${prefix}/bin`
}

/**
 * Run a npm command, returning stdout (trimmed). Throws on non-zero exit.
 * @param {string} args Arguments
 * @param {string} [cwd] Current working directory
 * @returns {string} Returns stdout/stderr output
 */
export function npmSync (args, cwd = process.cwd()) {
  return execSync(`npm ${args}`, { cwd, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim()
}

/**
 * Read .npmignore
 * @param {string} [cwd] Current working directory
 * @returns {Promise<string>} Comma-deliminated list of ignore globs
 */
export async function readNPMIgnore (cwd = process.cwd()) {
  const path = join(cwd, '.npmignore')
  const contents = await readFile(path, 'utf8')
  return contents
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .join(',')
}

/**
 * Run a command from local and globally unstalled packages
 * @param {string} cmd Command
 * @param {string[]} args Script name
 * @param {string} [cwd] Current working directory
 * @param {boolean} [unsafe] Unsafe mode (Include ENV:PATH)
 * @returns {Promise<number>} Exit code of the script
 */
export async function runCommand (cmd, args, cwd = process.cwd(), unsafe = false) {
  // Setup scripts environment
  const runEnv = getEnv(cwd, unsafe)

  return new Promise((resolve, reject) => {
    const child = spawn(cmd, [...args], { cwd, env: runEnv, stdio: 'inherit' })
    child.on('error', reject)
    child.on('exit', (/** @type {number} */ code) => resolve(code ?? 0))
  })
}

/**
 * Run a script from package.json
 * @param {string} name Script name
 * @param {string} [cwd] Current working directory
 * @returns {Promise<number>} Exit code of the script
 */
export async function runScript (name, cwd = process.cwd()) {
  const pkg = new Package()
  const script = String(pkg.scripts?.[name])
  if (!script) {
    throw new Error(`Missing script: '${name}'`)
  }

  // Setup scripts environment
  const scriptEnv = getEnv(cwd)

  // Execute one script
  if (!script.includes('&&')) {
    return await execScript(script, cwd, scriptEnv)
  }

  const scripts = script.split('&&').map(script => script.trim())
  let fail = false
  for (const script of scripts) {
    try {
      const code = await execScript(script, cwd, scriptEnv)
      if (code !== 0) {
        fail = true
      }
    } catch (error) {
      fail = true
      if (error instanceof Error) {
        console.log(error.message)
      } else {
        console.error(`Unexpected error: ${error}`)
      }
      process.exit(1)
    }
  }

  return fail ? 1 : 0
}

/**
 * Prepend node_modules/.bin to PATH so local binaries resolve
 * @private
 * @param {string} [cwd] Current working directory
 * @param {boolean} [unsafe] Unsafe mode (Include ENV:PATH)
 * @returns {NodeJS.ProcessEnv} Current environment patched with node_modules/.bin
 */
function getEnv (cwd = process.cwd(), unsafe = false) {
  const local = localBin(cwd)
  const pathKey = process.platform === 'win32' ? 'Path' : 'PATH'
  if (!unsafe) {
    const global = globalBin()
    return {
      [pathKey]: `${local}${delimiter}${global}`
    }
  } else {
    return {
      ...process.env,
      [pathKey]: `${local}${delimiter}${process.env[pathKey] ?? ''}`
    }
  }
}

/**
 * Execute the script asynchronously
 * @private
 * @param {string} script Script
 * @param {string} cwd Current working directory
 * @param {NodeJS.ProcessEnv} env Script environment
 * @returns {Promise<number>} Execution exitCode
 */
async function execScript (script, cwd, env) {
  // Append any extra args (ex `npm run foo -- --flag`)
  const parts = (String(script)).split(' -- ')
  const cmdParts = parts[0].split(' ')
  const cmd = cmdParts.shift() || ''
  const extraArgs = parts.length === 2 ? parts[1].split('') : []
  const args = [...cmdParts, ...extraArgs]

  return new Promise((resolve, reject) => {
    const child = spawn(cmd, [...args], { cwd, env, stdio: 'inherit' })
    child.on('error', reject)
    child.on('exit', (/** @type {number} */ code) => resolve(code ?? 0))
  })
}
