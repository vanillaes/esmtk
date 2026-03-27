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
  }).on('error', err => {
    console.error(`${err}`)
  })

  child.stdout.on('data', (data) => {
    process.stdout.write(`${data}`)
  })

  child.stderr.on('data', (data) => {
    if (data.toString() === 'lint-es: Run `lint-es --fix` to automatically fix some problems.\n') {
      process.stderr.write('esmtk: Run `esmtk lint --fix` to automatically fix some problems.\n')
    } else {
      process.stderr.write(`${data}`)
    }
  })
}
