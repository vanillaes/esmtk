import { spawn } from 'child_process'

/**
 * Test runnner using Tape-ES
 * @param {string} glob the glob to match test files
 * @param {object} options 'test' options
 */
export async function test (glob, options) {
  const args = []
  args.push('./node_modules/.bin/tape-es')
  args.push(glob)
  if (options?.ignore) {
    args.push('--ignore')
    args.push(options.ignore)
  }
  if (options?.cwd) {
    args.push('--cwd')
    args.push(options.cwd)
  }
  if (options?.watch) {
    args.push('--watch')
  }

  const child = spawn('node', args, {
    cwd: process.cwd(),
    stdio: ['pipe', 'pipe', 'pipe']
  })

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
    if (code === 1) {
      process.exitCode = 1
    }
  })
}
