#!/usr/bin/env node
import { bundle, clean, cp, commonjs, init, lint, minify, preview, rm, test, type, typings } from './commands/index.js'
import { Command } from 'commander'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pkg = require('../package.json')

const program = new Command()
  .version(pkg.version, '-v, --version')

program.command('init')
  .description('Create a package.json file for ECMAScript module development')
  .option('--scripts', 'Include ESMTK scripts')
  .action((options) => {
    init(options)
  })

program.command('test')
  .description('Run tests using Tape-ES')
  .argument('[glob]', 'The glob pattern used to find test files (default: `**/*.spec.js`)', '**/*.spec.js')
  .option('--ignore <ignore>', 'the ignore matcher pattern (default `**/node_modules/**`)')
  .option('--cwd <cwd>', 'the current working directory (default `process.cwd()`)')
  .option('--watch', 'Watch the files for changes')
  .action((glob, options) => {
    test(glob, options)
  })

program.command('lint')
  .description('Lint the source using Lint-ES')
  .option('--cwd <cwd>', 'the current working directory (default `process.cwd()`)')
  .option('--fix', 'Automatically fix problems')
  .action(options => {
    const flags = options.fix ? ['--fix'] : []
    lint(flags)
  })

program.command('type <entry>')
  .description('Type check the JSDoc typings using Typescript')
  .option('--module <module>', 'Module resolution type (default esnext)', 'esnext')
  .option('--strict', 'Enable \'strict mode\'')
  .option('--types <types>', 'specify type package names to include (ex `node` for `@types/node`)')
  .action((entry, options) => {
    type(entry, options)
  })

program.command('typings <entry>')
  .description('Generate typings from JSDoc using Typescript')
  .option('--module <module>', 'Module resolution type (default esnext)', 'esnext')
  .option('--types <types>', 'specify type package names to include (ex `node` for `@types/node`)')
  .action((entry, options) => {
    typings(entry, options)
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

program.command('clean')
  .description('Clean build artificts')
  .argument('[cwd]', 'The current working directory (default cwd)', process.cwd())
  .option('--bundle [bundle]', 'Clean bundled build artifacts (default: **/*.esm.js)')
  .option('--minify [minify]', 'Clean minified build artifacts (default: **/*.min.js)')
  .option('--typings [typings]', 'Clean typing artifacts (default: **/*.d.ts)')
  .option('--custom <custom>', 'Clean based on a user-defined pattern')
  // .option('-f, --force', 'Do not prompt before overwriting', false)
  .action((cwd, options) => {
    // set --bundle default
    if (options?.bundle && typeof (options.bundle) === 'boolean') {
      options.bundle = '**/*.esm.js'
    }
    // set --minify default
    if (options?.minify && typeof (options.minify) === 'boolean') {
      options.minify = '**/*.min.js'
    }
    // set --typings default
    if (options?.typings && typeof (options.typings) === 'boolean') {
      options.typings = '**/*.d.ts'
    }

    clean(cwd, options)
  })

program.command('preview')
  .description('Preview the package contents included during \'npm publish\'')
  .option('--cwd <cwd>', 'the current working directory (default `process.cwd()`)', process.cwd())
  .action((options) => {
    preview(options)
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
  // .option('-f, --force', 'Do not prompt before overwriting', false)
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
  // .option('-f, --force', 'Do not prompt before overwriting', false)
  .option('-r, --recursive', 'Remove directories recursively', false)
  .action((paths, options) => {
    rm(paths, options)
  })

program.parse(process.argv)
