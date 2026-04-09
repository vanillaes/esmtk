import { installed, Package, which } from '../../src/index.js'
import { spawn } from 'node:child_process'

/**
 * Type Check the JSDOC typings
 * @param {string} [entry] the entry point
 * @param {object} [options] 'types' options
 * @param {string} [options.module] Module resolution type
 * @param {boolean} [options.strict] Enable 'strict mode' type checks
 * @param {string} [options.types] Specify type package names to include
 */
export async function type (entry = '', options = {}) {
  const npmExists = await which('npm')
  if (!npmExists) {
    console.error('npm not found')
    console.error('is node installed?')
    process.exitCode = 1
    return
  }

  const esbuildExists = await installed('typescript')
  if (!esbuildExists) {
    console.error('typescript not found')
    console.error('typescript can be installed with `npm i -g typescript`')
    process.exitCode = 1
    return
  }

  if (!entry) {
    const pkg = new Package()
    entry = pkg.resolve()
  }

  const args = []
  args.push(entry)
  args.push('-t')
  args.push('esnext')
  args.push('--allowJS')
  args.push('--checkJS')
  if (options?.module) {
    args.push('--module')
    args.push(options.module)
  }
  args.push('--noEmit')
  args.push('--skipLibCheck')
  if (options?.strict) {
    args.push('--strict')
  }
  if (options?.types) {
    args.push('--types')
    args.push(options.types)
  }

  const child = spawn('tsc', args, {
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
