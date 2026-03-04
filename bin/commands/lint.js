import { spawn } from 'child_process'
import { join } from 'path'

const BIN_PATH = join(process.cwd(), 'node_modules', '.bin', 'standard')

export async function lint (flags) {
  const child = spawn(BIN_PATH, flags, {
    cwd: process.cwd(),
    stdio: ['pipe', 'pipe', 'pipe']
  }).on('error', err => {
    console.error(`test${err}`)
  })

  child.stdout.on('data', (data) => {
    process.stdout.write(`${data}`)
  })

  child.stderr.on('data', (data) => {
    if (data.toString() === 'standard: Run `standard --fix` to automatically fix some problems.\n') {
      process.stderr.write('standard: Run `esmtk lint --fix` to automatically fix some problems.\n')
    } else {
      process.stderr.write(`${data}`)
    }
  })
}
