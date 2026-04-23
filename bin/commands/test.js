import { spawn } from 'child_process'
import { join } from 'path'

/**
 * Test runnner using Tape-ES
 * @param {string} [files] File(s)/glob(s) to test
 * @param {object} [options] 'test' options
 * @param {string} [options.cwd] Current working directory
 * @param {string} [options.ignore] Files(s)/glob(s) to ignore
 * @param {boolean} [options.watch] Watch for changes to the test(s)
 */
export async function test (files = '**/*.spec.js', options = {}) {
  const {
    cwd = process.cwd(),
    ignore = '**/node_modules/**',
    watch
  } = options

  const command = join(process.cwd(), 'node_modules', '.bin', 'tape-es')
  const args = []
  args.push(files)
  if (options.cwd) {
    args.push('--cwd')
    args.push(cwd)
  }
  if (ignore) {
    args.push('--ignore')
    args.push(ignore)
  }
  if (watch) {
    args.push('--watch')
  }

  const child = spawn(command, args, { cwd, stdio: ['pipe', 'pipe', 'pipe'] })

  child.stdout.on('data', (data) => {
    process.stdout.write(`${data}`)
  })

  child.stderr.on('data', (data) => {
    data = data.toString()
    if (data === 'Debugger attached.\n' || data === 'Waiting for the debugger to disconnect...\n') {
      return
    }
    process.stderr.write(data)
    process.exitCode = 1
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
