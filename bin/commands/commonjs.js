import { installed, which } from '../../src/util.js'
import { spawn } from 'child_process'

/**
 * Bundle CJS (CommonJS) code
 * @param {string} input the input path
 * @param {string} output the output path
 */
export async function commonjs (input, output) {
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

  spawn('esbuild', ['--format=cjs', '--bundle', input, `--outfile=${output}`], {
    cwd: process.cwd(),
    stdio: ['pipe', process.stdout, process.stderr]
  }).on('error', err => {
    console.error(err)
  })
}
