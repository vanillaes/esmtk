import { spawn } from 'child_process'
import { join } from 'path'

const BIN_PATH = join(process.cwd(), 'node_modules', '.bin', 'lint-es')

/**
 * Lint the source code (using Lint-ES)
 * @param {object} options 'lint' options
 * @param {string} [options.cwd] Current working directory
 * @param {boolean} [options.fix] Automatically fix problems
 * @param {string} [options.ignore] File(s) to ignore
 */
export async function lint (options = {}) {
  const {
    cwd = process.cwd(),
    fix,
    ignore
  } = options

  const args = []
  if (options.cwd) {
    args.push('--cwd')
    args.push(cwd)
  }
  if (fix) {
    args.push('--fix')
  }
  if (ignore) {
    args.push('--ignore')
    args.push(ignore)
  }

  const child = spawn(BIN_PATH, args, { cwd, stdio: ['pipe', 'pipe', 'pipe'] })

  child.stdout.on('data', (data) => {
    process.stdout.write(`${data}`)
  })

  child.stderr.on('data', (data) => {
    data = data.toString()
    // VSCode debug dumps to stderr for some reason, ignore it
    if (data === 'Debugger attached.\n' || data === 'Waiting for the debugger to disconnect...\n') {
      return
    }

    // catch the --fix message and rewrite it
    if (data.startsWith('lint-es: Run `lint-es --fix` to automatically fix some problems.\n')) {
      process.stderr.write('esmtk: Run `esmtk lint --fix` to automatically fix some problems.\n')
      return
    } else {
      process.stderr.write(data)
    }
    process.exitCode = 1
  })

  // handle errors
  child.on('error', error => {
    console.error(`${error}`)
    process.exitCode = 1
  })

  // forward the error code
  child.on('close', (/** @type {number} */ code) => {
    if (code !== 0) {
      process.exitCode = 1
    }
  })
}
