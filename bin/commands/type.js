import { installed, which } from '../../src/index.js'
import { spawn } from 'child_process'

/**
 * @typedef Options
 * @property {string} module Module resolution type
 * @property {boolean} strict Enable 'strict mode' type checks
 * @property {string} types Specify type package names to include
 */

/**
 * Type Check the JSDOC typings
 * @param {string} entry the entry point
 * @param {Options} options 'types' options
 */
export async function type (entry, options) {
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
