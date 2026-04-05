import { spawn } from 'child_process'
import { join } from 'path'

const BIN_PATH = join(process.cwd(), 'node_modules', '.bin', 'lint-es')

/**
 * Lint the source code (using Lint-ES)
 * @param {object} options 'lint' options
 */
export async function lint (options) {
  const args = []
  if (options?.fix) {
    args.push('--fix')
  }

  const child = spawn(BIN_PATH, args, {
    cwd: process.cwd(),
    stdio: ['pipe', 'pipe', 'pipe']
  })

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

  child.on('error', error => {
    console.error(`${error}`)
    process.exitCode = 1
  })

  // forward the error code
  child.on('close', (/** @type {number} */ code) => {
    if (code === 1) {
      process.exitCode = 1
    }
  })
}
