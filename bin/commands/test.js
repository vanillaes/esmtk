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
  }).on('error', error => {
    console.error(error)
    process.exitCode = 1
  })

  child.stdout.on('data', (data) => {
    process.stdout.write(`${data}`)
  })

  child.stderr.on('data', (data) => {
    process.stderr.write(`${data}`)
    process.exitCode = 1
  })
}
