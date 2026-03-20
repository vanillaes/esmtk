#!/usr/bin/env node
import { bundle, cp, commonjs, lint, minify, rm, types, typings } from './commands/index.js'
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

program.command('types <entry>')
  .description('Type check the JSDoc typings using Typescript')
  .option('--strict', 'Enable strict type checks')
  .action((entry, options) => {
    types(entry, options)
  })

program.command('typings <entry>')
  .description('Generate typings from JSDoc using Typescript')
  .action((entry) => {
    typings(entry)
  })

program.command('bundle <input> <output>')
  .description('Bundle the source using ESBuild')
  .option('--platform <platform>', 'Target a specific platform (ex node)')
  .action((input, output, options) => {
    bundle(input, output, options)
  })

program.command('commonjs <input> <output>')
  .description('Transpile the source to CommonJS using ESBuild')
  .option('--platform <platform>', 'Target a specific platform (ex node)')
  .action((input, output, options) => {
    commonjs(input, output, options)
  })

program.command('minify <input> <output>')
  .description('Minify the source using ESBuild')
  .option('--platform <platform>', 'Target a specific platform (ex node)')
  .option('--sourcemap', 'Generate a source map')
  .action((input, output, options) => {
    minify(input, output, options)
  })

program.command('cp')
  .usage(`[-r] source target

    Examples:
      $ cp SOURCE DEST
      $ cp SOURCE... DIRECTORY
      $ cp SOURCEGLOB... DIRECTORY
      $ cp -r SOURCEDIR DIRECTORY
  `)
  .description('Copy files and directories')
  .argument('[paths...]')
  .option('-r, --recursive', 'Copy directories recursively', false)
  .action((paths, options) => {
    cp(paths, options)
  })

program.command('rm')
  .usage(`[-r] path/glob

    Examples:
      $ rm FILE
      $ rm FILES...
      $ rm GLOB...
      $ rm -r DIRECTORY
  `)
  .description('Remove files or directories')
  .argument('[paths...]')
  .option('-f, --force', 'Do not prompt before overwriting', false)
  .option('-r, --recursive', 'Remove directories recursively', false)
  .action((paths, options) => {
    rm(paths, options)
  })

program.parse(process.argv)
