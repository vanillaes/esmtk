import { execAsync } from '../util.js'
import { Package } from './package.js'
import { spawn } from 'node:child_process'
import { join, resolve, delimiter } from 'node:path'
import { readFile } from 'node:fs/promises'

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
 * Run a script from package.json, like `npm run <name>`
 * @param {string} name Script name
 * @param {object} options 'runScript' options
 * @param {string} [options.cwd] Current working directory
 * @param {NodeJS.ProcessEnv} [options.env] Current environment
 * @returns {Promise<number>} Exit code of the script
 */
export async function runScript (name, options = {}) {
  const {
    cwd = process.cwd(),
    env = process.env,
  } = options

  const pkg = new Package()
  const script = String(pkg.scripts?.[name])
  if (!script) {
    throw new Error(`Missing script: '${name}'`)
  }

  // Setup scripts environment
  const scriptEnv = getScriptEnv(cwd, env)

  // Execute one script
  if (!script.includes('&&')) {
    return await execScript(script, cwd, scriptEnv)
  }

  const scripts = script.split('&&').map(script => script.trim())
  let fail = false
  for (const script of scripts) {
    try {
      const code = await execScript(script, cwd, env)
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
 * @param {string} cwd Current working directory
 * @param {NodeJS.ProcessEnv} env Current Environment
 * @returns {NodeJS.ProcessEnv} Current environment patched with node_modules/.bin
 */
function getScriptEnv (cwd, env) {
  const binPath = resolve(cwd, 'node_modules', '.bin')
  const pathKey = process.platform === 'win32' ? 'Path' : 'PATH'
  return {
    ...env,
    [pathKey]: `${binPath}${delimiter}${env[pathKey] ?? ''}`,
  }
}

/**
 * Execute the script asynchronously
 * @private
 * @param {string} script Script
 * @param {string} cwd Current working directory
 * @param {NodeJS.ProcessEnv} env Script Environment
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
