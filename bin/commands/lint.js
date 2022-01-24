import spawn from 'cross-spawn'
import { join } from 'path'

const BIN_PATH = join(process.cwd(), 'node_modules', '.bin', 'standard')

export async function lint (flags) {
  spawn(BIN_PATH, flags, {
    cwd: process.cwd(),
    stdio: ['pipe', process.stdout, process.stderr]
  }).on('error', err => {
    console.error(err)
  })
}
