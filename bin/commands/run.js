import { runCommand } from '../../src/npm/util.js'

/**
 * Run a command (local and global packages only)
 * @param {string[]} argv Raw arguments
 */
export async function run (argv) {
  const cmd = argv.shift()
  if (!cmd) {
    throw new Error('run: No command specified')
  }
  const args = [...argv]
  const exitCode = await runCommand(cmd, args)
  process.exitCode = exitCode
}
