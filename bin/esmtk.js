#!/usr/bin/env node
import cli from 'commander'
import { preflight } from '../src/preflight.js'
import { lint } from './commands/lint.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pkg = require('../package.json')

preflight()

cli.version(pkg.version, '-v, --version')
cli.command('lint')
  .description('Lint the package using StandardJS')
  .option('--fix', 'Automatically fix problems')
  .action(opt => {
    const flags = opt.fix ? ['--fix'] : []
    lint(flags)
  })

cli.parse(process.argv)
