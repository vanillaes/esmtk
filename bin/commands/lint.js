import { spawn } from 'child_process'
import { fileURLToPath } from 'url'

const BIN_PATH = fileURLToPath(new URL('../../node_modules/.bin/standard', import.meta.url))

export async function lint (flags) {
  spawn(BIN_PATH, flags, {
    cwd: process.cwd(),
    stdio: ['pipe', process.stdout, process.stderr]
  }).on('error', err => {
    console.error(err)
  })
}
