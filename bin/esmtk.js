#!/usr/bin/env node
import { bundle, clean, init, lint, minify, preview, test, type, typings, version } from './commands/index.js'
import { Package } from '../src/index.js'
import { Command } from 'commander'

const pkg = new Package()
const program = new Command()
  .version(pkg?.version || '', '-v, --version')

program.command('init')
  .description('Create a package.json file for ECMAScript module development')
  .option('--scripts', 'Include ESMTK scripts')
  .action((options) => {
    init(options)
  })

program.command('test')
  .description('Run tests using Tape-ES')
  .argument('[glob]', 'glob(s) used to locate test files', '**/*.spec.js')
  .option('--cwd <cwd>', 'current working directory', process.cwd())
  .option('--ignore <ignore>', 'glob(s) to ignore', '**/node_modules/**')
  .option('--watch', 'watch for changes to tests')
  .action((glob, options) => {
    test(glob, options)
  })

program.command('lint')
  .description('Lint the source using Lint-ES')
  .option('--cwd <cwd>', 'current working directory', process.cwd())
  .option('--fix', 'automatically fix problems')
  .option('--ignore <ignore>', 'file(s) to ignore')
  .action((options) => {
    lint(options)
  })

program.command('type')
  .description('Type check the JSDoc typings using Typescript')
  .argument('[entry]', 'entry-point for the source (default: [entry-point].js')
  .option('--module <module>', 'module resolution type', 'esnext')
  .option('--strict', 'enable \'strict mode\' type checks')
  .option('--types <types>', 'specify type package names to include (ex `node` for `@types/node`)')
  .action((entry, options) => {
    type(entry, options)
  })

program.command('bundle')
  .description('Bundle the source using ESBuild')
  .argument('[input]', 'Input source file path (default: [entry-point].js')
  .argument('[output]', 'Output bundle file path (default: [entry-point].esm.js')
  .option('--platform <platform>', 'target platform (ex node)')
  .action((input, output, options) => {
    bundle(input, output, options)
  })

program.command('minify')
  .description('Minify the source using ESBuild')
  .argument('[input]', 'input source file path (default: [entry-point].js')
  .argument('[output]', 'output minified bundle file path (default: [entry-point].min.js')
  .option('--platform <platform>', 'target platform (ex node)')
  .option('--sourcemap', 'generate a source map for the minified bundle')
  .action((input, output, options) => {
    minify(input, output, options)
  })

program.command('typings')
  .description('Generate typings from JSDoc using Typescript')
  .argument('[entry]', 'entry-point for the source (default: [entry-point].js')
  .option('--module <module>', 'module resolution type', 'esnext')
  .option('--types <types>', 'specify type package names to include (ex `node` for `@types/node`)')
  .action((entry, options) => {
    typings(entry, options)
  })

program.command('clean')
  .description('Clean build artificts')
  .argument('[cwd]', 'Current working directory', process.cwd())
  .option('--bundle [bundle]', 'Clean bundled build artifacts (default: **/*.esm.js)')
  .option('--minify [minify]', 'Clean minified build artifacts (default: **/*.min.js)')
  .option('--typings [typings]', 'Clean typing artifacts (default: **/*.d.ts)')
  .option('--custom <custom>', 'Clean based on a user-defined pattern')
  // .option('-f, --force', 'Ignore errors', false)
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
  .description('Preview the published package contents')
  .option('--cwd <cwd>', 'current working directory', process.cwd())
  .action((options) => {
    preview(options)
  })

program.command('version')
  .description('Bump the package version and tag the release in Git')
  .argument('<release>', 'major | minor | patch | premajor | preminor | prepatch | prerelease | <version>')
  .option('--allow-same-version', 'Allow the version if it already exists (default: false)')
  .option('--cwd <cwd>', 'Current working directory', process.cwd())
  .option('--force', 'Commit even if the working directory is not clean (default: false)')
  .option('--no-git-tag-version', 'Tag the version in git? (default: true)')
  .option('--message <message>', 'Git commit message (%s is replaced with the version number in the message)')
  .option('--preid <preid>', 'Pre-release identifier (ex "rc" -> 1.2.0-rc.8)')

  .action((release, options) => {
    version(release, options)
  })

program.parse(process.argv)
