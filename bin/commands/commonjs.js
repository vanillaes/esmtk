import { installed, which } from '../../src/index.js'
import { spawn } from 'child_process'

/**
 * Bundle CJS (CommonJS) code
 * @param {string} input the input path
 * @param {string} output the output path
 * @param {any} options commonjs options
 */
export async function commonjs (input, output, options) {
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
  args.push('--bundle')
  args.push('--format=cjs')
  if (options?.platform) {
    args.push(`--platform=${options?.platform}`)
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
