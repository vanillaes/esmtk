import { installed, which } from '../../src/index.js'
import { spawn } from 'child_process'

/**
 * @typedef Options
 * @property {string} module Module resolution type
 * @property {boolean} strict Enable 'strict mode' type checks
 * @property {string} types Specify type package names to include
 */

/**
 * Generate Typescript typings from JSDoc
 * @param {string} entry the entry point
 * @param {Options} options 'typings' options
 */
export async function typings (entry, options) {
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
  args.push('--declaration')
  args.push('--emitDeclarationOnly')
  if (options?.module) {
    args.push('--module')
    args.push(options.module)
  }
  args.push('--noEmitOnError')
  args.push('--skipLibCheck')
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
    if (code === 1) {
      process.exitCode = 1
    }
  })
}
