import { installed, which } from '../../src/index.js'
import { spawn } from 'child_process'

/**
 * Type Check the JSDOC typings
 * @param {string} entry the entry point
 */
export async function types (entry, options) {
  const npmExists = await which('npm')
  if (!npmExists) {
    console.error('npm not found')
    console.error('is node installed?')
    process.exit(1)
  }

  const esbuildExists = await installed('typescript')
  if (!esbuildExists) {
    console.error('typescript not found')
    console.error('typescript can be installed with `npm i -g typescript`')
    process.exit(1)
  }

  const args = []
  args.push(entry)
  args.push('-t')
  args.push('esnext')
  args.push('--allowJS')
  args.push('--checkJS')
  args.push('--noEmit')
  args.push('--skipLibCheck')
  if (options?.strict) {
    args.push('--strict')
  }

  spawn('tsc', args, {
    cwd: process.cwd(),
    stdio: ['pipe', process.stdout, process.stderr]
  }).on('error', err => {
    console.error(err)
  })
}
