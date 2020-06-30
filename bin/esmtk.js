#!/usr/bin/env node
import cli from 'commander'
import { preflight } from '../src/preflight.js'
import { bundle, lint, minify } from './commands/index.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pkg = require('../package.json')

preflight()

cli.version(pkg.version, '-v, --version')
cli.command('bundle <input> <output>')
  .description('Bundle the source using ESBuild')
  .action((input, output) => {
    bundle(input, output)
  })
cli.command('minify <input> <output>')
  .description('Minify the source using ESBuild')
  .action((input, output) => {
    minify(input, output)
  })
cli.command('lint')
  .description('Lint the package using StandardJS')
  .option('--fix', 'Automatically fix problems')
  .action(opt => {
    const flags = opt.fix ? ['--fix'] : []
    lint(flags)
  })
cli.parse(process.argv)
