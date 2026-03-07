import { installed, which } from '../../src/util.js'
import { spawn } from 'child_process'

/**
 * Type Check the JSDOC typings
 * @param {string} entry the entry point
 */
export async function types (entry) {
  const npmExists = await which('npm')
  if (!npmExists) {
    console.error('npm not found')
    console.error('is node installed?')
    return
  }

  const esbuildExists = await installed('typescript')
  if (!esbuildExists) {
    console.error('typescript not found')
    console.error('typescript can be installed with `npm i -g typescript`')
    return
  }

  spawn('tsc', [entry, '-t', 'esnext', '--allowJS', '--checkJS', '--skipLibCheck', '--noEmit'], {
    cwd: process.cwd(),
    stdio: ['pipe', process.stdout, process.stderr]
  }).on('error', err => {
    console.error(err)
  })
}
