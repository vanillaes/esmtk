import { installed, which } from '../../src/index.js'
import { spawn } from 'child_process'

/**
 * Bundle and minify ESM (ECMAScript Module) code (with tree-shaking)
 * @param {string} input the input path
 * @param {string} output the output path
 */
export async function minify (input, output, options) {
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

  const args = []
  args.push('--format=esm')
  args.push('--minify')
  args.push('--bundle')
  if (options?.sourcemap) {
    args.push('--sourcemap')
  }
  args.push(input)
  args.push(`--outfile=${output}`)

  spawn('esbuild', args, {
    cwd: process.cwd(),
    stdio: ['pipe', process.stdout, process.stderr]
  }).on('error', err => {
    console.error(err)
  })
}
