import { installed, Package, which } from '../../src/index.js'
import { spawn } from 'child_process'

/**
 * Bundle and minify ESM (ECMAScript Module) code (with tree-shaking)
 * @param {string} [input] the input path
 * @param {string} [output] the output path
 * @param {object} [options] 'minify' options
 * @param {string} [options.platform] Target platform
 * @param {boolean} [options.sourcemap] Generate a source map for the minified bundle
 */
export async function minify (input = '', output = '', options = {}) {
  const npmExists = await which('npm')
  if (!npmExists) {
    console.error('npm not found')
    console.error('is node installed?')
    process.exitCode = 1
    return
  }

  const esbuildExists = await installed('esbuild')
  if (!esbuildExists) {
    console.error('esbuild not found')
    console.error('esbuild can be installed with `npm i -g esbuild`')
    process.exitCode = 1
    return
  }

  if (!input) {
    const pkg = new Package()
    input = pkg.resolve()
  }

  if (!output) {
    output = input.replace('.js', '.min.js')
  }

  const args = []
  args.push('--bundle')
  args.push('--format=esm')
  args.push('--minify')
  if (options?.platform) {
    args.push(`--platform=${options?.platform}`)
  }
  if (options?.sourcemap) {
    args.push('--sourcemap')
  }
  args.push(input)
  args.push(`--outfile=${output}`)

  const child = spawn('esbuild', args, {
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
