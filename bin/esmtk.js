#!/usr/bin/env node
import { bundle, cp, commonjs, lint, minify } from './commands/index.js'
import { Command } from 'commander'
import { createRequire } from 'module'
const program = new Command()
const require = createRequire(import.meta.url)
const pkg = require('../package.json')

program.version(pkg.version, '-v, --version')

program.command('lint')
  .description('Lint the source using StandardJS')
  .option('--fix', 'Automatically fix problems')
  .action(options => {
    const flags = options.fix ? ['--fix'] : []
    lint(flags)
  })

program.command('bundle <input> <output>')
  .description('Bundle the source using ESBuild')
  .action((input, output) => {
    bundle(input, output)
  })

program.command('commonjs <input> <output>')
  .description('Transpile the source to CommonJS using ESBuild')
  .action((input, output) => {
    commonjs(input, output)
  })

program.command('minify <input> <output>')
  .description('Minify the source using ESBuild')
  .action((input, output) => {
    minify(input, output)
  })

program.command('cp <source> <target>')
  .usage('[-rf] source target')
  .description('Copy files from the source to the target')
  .option('-f, --force', 'do not prompt before overwriting')
  .option('-r, --recursive', 'copy directories recursively')
  .action((opt) => {
    cp(opt)
  })

program.parse(process.argv)
