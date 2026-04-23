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
  .argument('[files]', 'File(s)/glob(s) to test (default: **/*.spec.js')
  .option('--cwd <cwd>', 'Current working directory')
  .option('--ignore <ignore>', 'Files(s)/glob(s) to ignore (default: **/node_modules/**')
  .option('--watch', 'Watch for changes')
  .action((files, options) => {
    test(files, options)
  })

program.command('lint')
  .description('Lint the source using Lint-ES')
  .argument('[files]', 'File(s)/glob(s) to lint (default: **/*.js)')
  .option('--cwd <cwd>', 'Current working directory')
  .option('--fix', 'Automatically fix problems')
  .option('--ignore <ignore>', 'File(s)/glob(s) to ignore')
  .action((files, options) => {
    lint(files, options)
  })

program.command('type')
  .description('Type check the JSDoc typings using Typescript')
  .argument('[entry]', 'Entry-point for the source (default: [entry-point].js')
  .option('--module <module>', 'Module resolution type', 'esnext')
  .option('--strict', 'Enable \'strict mode\' type checks')
  .option('--types <types>', 'Specify type package names to include (ex `node` includes `@types/node`)')
  .action((entry, options) => {
    type(entry, options)
  })

program.command('bundle')
  .description('Bundle the source using ESBuild')
  .argument('[input]', 'Input source file path (default: [entry-point].js')
  .argument('[output]', 'Output bundle file path (default: [entry-point].esm.js')
  .option('--platform <platform>', 'Target platform (default: neutral)')
  .action((input, output, options) => {
    bundle(input, output, options)
  })

program.command('minify')
  .description('Minify the source using ESBuild')
  .argument('[input]', 'Input source file path (default: [entry-point].js')
  .argument('[output]', 'Output minified bundle file path (default: [entry-point].min.js')
  .option('--platform <platform>', 'Target platform (ex node)')
  .option('--sourcemap', 'Generate a source map for the minified bundle')
  .action((input, output, options) => {
    minify(input, output, options)
  })

program.command('typings')
  .description('Generate typings from JSDoc using Typescript')
  .argument('[entry]', 'Entry-point for the source (default: [entry-point].js')
  .option('--module <module>', 'Module resolution type', 'esnext')
  .option('--types <types>', 'Specify type package names to include (ex `node` for `@types/node`)')
  .action((entry, options) => {
    typings(entry, options)
  })

program.command('clean')
  .description('Clean build artificts')
  .option('--cwd <cwd>', 'Current working directory')
  .option('--bundle [bundle]', 'Clean bundled build artifacts (default: **/*.esm.js)')
  .option('--minify [minify]', 'Clean minified build artifacts (default: **/*.min.js)')
  .option('--typings [typings]', 'Clean typing artifacts (default: **/*.d.ts)')
  .option('--custom <custom>', 'Clean based on a user-defined pattern')
  .action((options) => {
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

    clean(options)
  })

program.command('preview')
  .description('Preview the published package contents')
  .option('--cwd <cwd>', 'Current working directory', process.cwd())
  .action((options) => {
    preview(options)
  })

program.command('version')
  .description('Bump the package version and tag the release in Git')
  .argument('<release>', 'major | minor | patch | premajor | preminor | prepatch | prerelease | <version>')
  .option('--cwd <cwd>', 'Current working directory')
  .option('--no-git-tag-version', 'Tag the version in git? (default: true)')
  .option('--message <message>', 'Git commit message, %s will be replace with the version number (default: v%s)')
  .option('--preid <preid>', 'Pre-release identifier (ex "rc" -> 1.2.0-rc.8)')

  .action((release, options) => {
    version(release, options)
  })

program.parse(process.argv)
