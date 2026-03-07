import { installed, which } from '../../src/util.js'
import { spawn } from 'child_process'

/**
 * Bundle ESM (ECMAScript Module) code (with tree-shaking)
 * @param {string} input the input path
 * @param {string} output the output path
 */
export async function bundle (input, output) {
  const npmExists = await which('npm')
  if (!npmExists) {
    console.error('npm not found')
    console.error('is node installed?')
    return
  }

  const esbuildExists = await installed('esbuild')
  if (!esbuildExists) {
    console.error('esbuild not found')
    console.error('esbuild can be installed with `npm i -g esbuild`')
    return
  }

  spawn('esbuild', ['--format=esm', '--bundle', input, `--outfile=${output}`], {
    cwd: process.cwd(),
    stdio: ['pipe', process.stdout, process.stderr]
  }).on('error', err => {
    console.error(err)
  })
}
