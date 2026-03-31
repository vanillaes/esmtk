import { installed, which } from '../../src/index.js'
import { spawn } from 'child_process'

/**
 * Generate Typescript typings from JSDoc
 * @param {string} entry the entry point
 */
export async function typings (entry) {
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

  spawn('tsc', [entry, '-t', 'esnext', '--allowJS', '--checkJS', '--skipLibCheck', '--declaration', '--emitDeclarationOnly', '--noEmitOnError'], {
    cwd: process.cwd(),
    stdio: ['pipe', process.stdout, process.stderr]
  }).on('error', error => {
    console.error(error)
    process.exitCode = 1
  })
}
