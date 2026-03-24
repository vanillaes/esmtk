import { spawn } from 'child_process'

/**
 * Test runnner using Tape-ES
 * @param {string} glob the glob to match test files
 * @param {any} options bundle options
 */
export async function test (glob, options) {
  const args = []
  args.push('./node_modules/.bin/tape-es')
  args.push(glob)
  if (options?.watch) {
    args.push('--watch')
  }
  if (options?.ignore) {
    args.push('--ignore')
    args.push(options.ignore)
  }

  spawn('node', args, {
    cwd: process.cwd(),
    stdio: ['pipe', process.stdout, process.stderr]
  }).on('error', err => {
    console.error(err)
  })
}
