import { spawn } from 'child_process'
import { join } from 'path'

const BIN_PATH = join(process.cwd(), 'node_modules', '.bin', 'esbuild')

export async function commonjs (input, output) {
  spawn(BIN_PATH, ['--format=cjs', '--bundle', input, `--outfile=${output}`], {
    cwd: process.cwd(),
    stdio: ['pipe', process.stdout, process.stderr]
  }).on('error', err => {
    console.error(err)
  })
}
