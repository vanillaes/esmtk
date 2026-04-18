import { spawn } from 'child_process'

/**
 * Test runnner using Tape-ES
 * @param {string} glob the glob to match test files
 * @param {object} [options] 'test' options
 * @param {string} [options.cwd] Current working directory
 * @param {string} [options.ignore] File(s) to ignore
 * @param {boolean} [options.watch] Watch for changes to the test(s)
 */
export async function test (glob = '**/*.spec.js', options = {}) {
  const {
    cwd = process.cwd(),
    ignore = '**/node_modules/**',
    watch
  } = options

  const args = []
  args.push('./node_modules/.bin/tape-es')
  args.push(glob)
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

  const child = spawn('node', args, { cwd, stdio: ['pipe', 'pipe', 'pipe'] })

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
