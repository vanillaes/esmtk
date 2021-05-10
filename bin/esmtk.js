#!/usr/bin/env node
import cli from 'commander'
import { bundle, cp, commonjs, lint, minify } from './commands/index.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pkg = require('../package.json')

cli.version(pkg.version, '-v, --version')
cli.command('lint')
  .description('Lint the package using StandardJS')
  .option('--fix', 'Automatically fix problems')
  .action(opt => {
    const flags = opt.fix ? ['--fix'] : []
    lint(flags)
  })
cli.command('bundle <input> <output>')
  .description('Bundle the source using ESBuild')
  .action((input, output) => {
    bundle(input, output)
  })
cli.command('commonjs <input> <output>')
  .description('Transpile the source to CommonJS using ESBuild')
  .action((input, output) => {
    commonjs(input, output)
  })
cli.command('minify <input> <output>')
  .description('Minify the source using ESBuild')
  .action((input, output) => {
    minify(input, output)
  })
cli.command('cp')
  .description('Copy files from the source to the destination')
  .usage('[options] [source] [destination]')
  .option('-f, --force', 'do not prompt before overwriting')
  .option('-r, --recursive', 'copy directories recursively')
  .action((opt) => {
    cp(opt)
  })
cli.parse(process.argv)
