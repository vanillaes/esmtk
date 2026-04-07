import { installed, readPackageJSON, which } from '../../src/index.js'
import { spawn } from 'child_process'

/**
 * @typedef Options
 * @property {string} [platform] Target platform
 */

/**
 * Bundle CJS (CommonJS) code
 * @param {string} [input] Input source file path
 * @param {string} [output] Output commonjs bundle file path
 * @param {Options} [options] 'commonjs' options
 */
export async function commonjs (input = '', output = '', options = {}) {
  const npmExists = await which('npm')
  if (!npmExists) {
    console.error('npm not found')
    console.error('is node installed?')
    process.exitCode = 1
    return
  }

  const esbuildExists = await installed('esbuild')
  if (!esbuildExists) {
    console.error('esbuild not found')
    console.error('esbuild can be installed with `npm i -g esbuild`')
    process.exitCode = 1
    return
  }

  if (!input) {
    const pkg = await readPackageJSON()
    if (!pkg.name) {
      throw new Error('No project name found in package.json')
    }
    input = (import.meta.resolve(pkg?.name).replace('file://', ''))
  }

  if (!output) {
    output = input.replace('.js', '.cjs')
  }

  const args = []
  args.push('--bundle')
  args.push('--format=cjs')
  if (options?.platform) {
    args.push(`--platform=${options?.platform}`)
  }
  args.push(input)
  args.push(`--outfile=${output}`)

  const child = spawn('esbuild', args, {
    cwd: process.cwd(),
    stdio: ['pipe', process.stdout, process.stderr]
  })

  // handle errors
  child.on('error', error => {
    console.error(error)
    process.exitCode = 1
  })

  // forward the error code
  child.on('close', (/** @type {number} */ code) => {
    if (code !== 0) {
      process.exitCode = 1
    }
  })
}
