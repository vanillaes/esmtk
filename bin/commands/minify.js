import spawn from 'cross-spawn'
import { join } from 'path'

const BIN_PATH = join(process.cwd(), 'node_modules', '.bin', 'esbuild')

export async function minify (input, output) {
  spawn(BIN_PATH, ['--format=esm', '--minify', '--bundle', input, `--outfile=${output}`], {
    cwd: process.cwd(),
    stdio: ['pipe', process.stdout, process.stderr]
  }).on('error', err => {
    console.error(err)
  })
}
