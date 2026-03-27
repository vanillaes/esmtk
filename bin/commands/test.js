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
  if (options?.root) {
    args.push('--root')
    args.push(options.root)
  }
  if (options?.watch) {
    args.push('--watch')
  }

  spawn('node', args, {
    cwd: process.cwd(),
    stdio: ['pipe', process.stdout, process.stderr]
  }).on('error', err => {
    console.error(err)
  })
}
