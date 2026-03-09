import { installed, which } from '../../src/index.js'
import { spawn } from 'child_process'

/**
 * Bundle and minify ESM (ECMAScript Module) code (with tree-shaking)
 * @param {string} input the input path
 * @param {string} output the output path
 */
export async function minify (input, output) {
  const npmExists = await which('npm')
  if (!npmExists) {
    console.error('npm not found')
    console.error('is node installed?')
    process.exit(1)
  }

  const esbuildExists = await installed('esbuild')
  if (!esbuildExists) {
    console.error('esbuild not found')
    console.error('esbuild can be installed with `npm i -g esbuild`')
    process.exit(1)
  }

  spawn('esbuild', ['--format=esm', '--minify', '--bundle', input, `--outfile=${output}`], {
    cwd: process.cwd(),
    stdio: ['pipe', process.stdout, process.stderr]
  }).on('error', err => {
    console.error(err)
  })
}
