<h1 align="center">ECMAScript Module Toolkit</h1>

<div align="center">ESMTK, essential tools for ECMAScript module development</div>

<br />

<div align="center">
  <a href="https://github.com/vanillaes/esmtk/releases"><img src="https://badgen.net/github/tag/vanillaes/esmtk?cache-control=no-cache" alt="GitHub Release"></a>
  <a href="https://npmjs.com/package/@vanillaes/esmtk"><img src="https://badgen.net/npm/dm/@vanillaes/esmtk?icon=npm" alt="NPM Monthly Downloads"></a>
  <a href="https://jsr.io/@vanillaes/esmtk"><img src="https://jsr.io/badges/@vanillaes/esmtk/weekly-downloads" alt="JSR Weekly Downloads"></a>
  <a href="https://jsr.io/@vanillaes/esmtk"><img src="https://jsr.io/badges/@vanillaes/esmtk/score" alt="JSR Score"></a>
  <a href="https://github.com/vanillaes/esmtk/actions"><img src="https://github.com/vanillaes/esmtk/workflows/Latest/badge.svg" alt="Latest Status"></a>
  <a href="https://github.com/vanillaes/esmtk/actions"><img src="https://github.com/vanillaes/esmtk/workflows/Release/badge.svg" alt="Release Status"></a>
</div>

## Commands

- [init](#init) - Create a package.json file for ECMAScript module development
- [test](#test) - Run tests ([Tape-ES][])
- [lint](#lint) - Lint the source code ([Lint-ES][])
- [type](#type) - Type check the JSDoc typings ([Typescript][])
- [bundle](#bundle) - Bundle the source code to an ECMAScript module ([ESBuild][])
- [minify](#minify) - Bundle and Minify the source code to an ECMAScript module ([ESBuild][])
- [typings](#typings) - Generate Type Declarations (.d.ts) from JSDoc ([Typescript][])
- [clean](#clean) - Clean up build artifacts
- [preview](#preview) - Preview the package contents included during `npm publish`
- [version](#version) - Bump the package version and tag the release in Git


## Init

Create a package.json file for ECMAScript module development

### Arguments

`esmtk init [...options]`

- `--scripts` - Include the ESMTK scripts?

### Usage

```sh
# init package.json
npx @vanillaes/esmtk init

# init package.json (including ESMTK scripts)
npx @vanillaes/esmtk init --scripts
```


## Test

Run tests ([Tape-ES][])

### Arguments

`esmtk test [...options] [glob]`

- `[glob]` - Glob(s) used to locate test files (default: `**/*.spec.js`)
- `--cwd <dir>` - The current working directory
- `--ignore <pattern(s)>` - Glob(s) to ignore (default: `**/node_modules/**`)
- `--watch` - Watch for changes to the test(s)

### Usage

```sh
# run the tests
esmtk test

# run the tests (using a different naming scheme)
esmtk test **/*.test.js

# run the tests (ignore tests)
esmtk test **/*.test.js --ignore **/node_modules/**,src/util.spec.js

# run the tests (change the current working directory)
esmtk test **/*.test.js --cwd src/

# run the tests (watch for changes)
esmtk test --watch
```


## Lint

Lint the source code ([Lint-ES][])

### Arguments

`esmtk lint [...options]`

- `[files]` - File(s)/glob(s) to lint (default: `**/*.js`)
- `--cwd <dir>` - Current working directory
- `--fix` - Automatically fix problems
- `--ignore <pattern(s)>` - File(s) to ignore

*Note: By default `lint-es` ignores `node_modules/`, `coverage/`, `vendor/`, `*.min.js`, hidden files, and files included in `.gitignore`.*

### Usage

```sh
# lint the sources
esmtk lint

# lint the sources (change the current working directory)
esmtk lint --cwd src/

# lint the sources and attempt to automatally fix the issues
esmtk lint --fix lint

# lint the sources (ignore files)
esmtk lint --ignore src/
```


## Type

Type check the JSDoc typings ([Typescript][])

### Arguments

`esmtk type [...options] [entry]`

- `[entry]` - Entry-point for the source (default: `[entry-point].js`)
- `--module <type>` - Module resolution type (default `esnext`). See [`tsc`][]
- `--strict` - Enable 'strict mode' type checks. See [`tsc`][]
- `--types <type(s)>` - Specify type package names to include (ex `node` for `@types/node`). See [`tsc`][]

### Usage

```sh
# type check the sources
esmtk type index.js

# type check the sources (with 'node' module resolution)
esmtk type --module nodenext index.js

# type check the sources (with 'strict mode' enabled)
esmtk type --strict index.js

# type check the sources (with '@types/node' typings included)
esmtk type --types node index.js
```

**Note: Due to Typescript limitations, inline JSDoc typings will be ignored if typings (ie `*.d.ts` files) exist.**


## Bundle

Bundle the source code to an ECMAScript module ([ESBuild][])

### Arguments

`esmtk bundle [...options] [input] [output]`

- `[input]` - Input source file path (default: `[entry-point].js`)
- `[output]` - Output bundle file path (default: `[entry-point].esm.js`)
- `--platform <target>` - Target platform (ex `neutral`). See [`esbuild --platform`][]

### Usage

```sh
# bundle ESM source -> ESM bundle
esmtk bundle src/sample.js bundle.js

# bundle ESM source -> ESM bundle (includes Node-specific bindings)
esmtk bundle --platform=node src/sample.js bundle.js
```


## Minify

Bundle and Minify the source code to an ECMAScript module ([ESBuild][])

### Arguments

`esmtk minify [...options] [input] [output]`

- `[input]` - Input source file path (default: `[entry-point].js`)
- `[output]` - Output minified bundle file path (default: `[entry-point].min.js`)
- `--platform <target>` - Target platform (default: `neutral`). See [`esbuild --platform`][]
- `--sourcemap` - Generate a source map for the minified bundle. See [`esbuild --sourcemap`][]

### Usage

```sh
# bundle ESM source -> minified ESM bundle
esmtk minify src/sample.js bundle.min.js

# bundle ESM source -> minified ESM bundle (includes Node-specific bindings)
esmtk minify --platform=node src/sample.js bundle.min.js

# bundle ESM source -> minified ESM bundle (output a sourcemap)
esmtk minify --sourcemap src/sample.js bundle.min.js
```


## Typings

Generate Type Declarations (.d.ts) from JSDoc ([Typescript][])

### Arguments

`esmtk typings [options...] [entry]`

- `[entry]` - Entry-point for the source (default: `[entry-point].js`)
- `--module <type>` - Module resolution type (default `esnext`). See [`tsc`][]
- `--strict` - Enable 'strict mode' type checks. See [`tsc`][]
- `--types <type(s)>` - Specify type package names to include (ex `node` for `@types/node`). See [`tsc`][]

### Usage

```sh
# generate .d.ts files for all linked source files
esmtk typings index.js

# generate .d.ts files for all linked source files (with 'node' module resolution)
esmtk typings --module nodenext index.js

# generate .d.ts files for all linked source files (with 'strict mode' enabled)
esmtk typings --strict index.js

# generate .d.ts files for all linked source files (with '@types/node' typings included)
esmtk typings --types node index.js
```


## Clean

Clean up build artifacts

### Arguments

`esmtk clean [...options]`

- `--bundle` - Clean bundled build artifacts (default: `**/*.esm.js`)
- `--minify` - Clean minified build artifacts (default: `**/*.min.js`)
- `--typings` - Clean typing artifacts (default: `**/*.d.ts`)
- `--custom [pattern]` - Clean based on a user-defined pattern

### Usage

```sh
# clean all build artifacts
esmtk clean --bundle --minify --typings

# override default extension
esmtk clean --bundle *.mjs

# define your own pattern
esmtk clean --custom *.scss.css
```

**Note: The `clean` command automatically ignores the contents of `node_modules/`**


## Preview

Preview the package contents included during `npm publish`

### Arguments

`esmtk preview [...options]`

- `--cwd <dir>` - Current working directory

### Usage

```sh
# preview the package contents
esmtk preview

# preview the package contents (from another directory)
esmtk preview --cwd some/other/dir
```


## Version

Bump the package version and tag the release in Git

Steps:
1. (if present) Run the `preversion` script
2. Bump the version in `package.json`
3. (if present) Bump the version in `package-lock.json`
4. (if present) Bump the version in `jsr.json`
5. (if present) Run the `version` script
6. Commit the changes and tag the commit with the version number in `git`
7. (if present) Run the `postversion` script

### Arguments

`esmtk version [...options] [release]`

- `[release]` - `major` | `minor` | `patch` | `premajor` | `preminor` | `prepatch` | `prerelease` | `<version>`
- `--cwd <dir>` - Current working directory
- `--no-git-tag-version` - Tag the version in git? (default: true)
- `--message <message>` - Git commit message, `%s` will be replace with the version number (default: v%s)
- `--preid <id>` - Pre-release identifier (ex "rc" -> 1.2.0-rc.8)

### Usage

```sh
# Bump the major version
esmtk version major

# Bump the minor version
esmtk version major

# Bump the patch version
esmtk version major

# Bump the patch version (change the current working directory)
esmtk version patch --cwd src/

# Bump the patch version (don't tag the release in git)
esmtk version patch --no-git-tag-version

# Bump the patch version (with a custom commit message on the tag)
esmtk version patch --message "Release %s"

# Bump the patch version (add the prerelease id, ex "rc" -> 1.2.0-rc.8)
esmtk version patch --preid rc
```

[ESBuild]: https://esbuild.github.io/
[`esbuild --platform`]: https://esbuild.github.io/api/#platform
[`esbuild --sourcemap`]: https://esbuild.github.io/api/#sourcemap
[Lint-ES]: https://github.com/vanillaes/lint-es
[Tape-ES]: https://github.com/vanillaes/tape-es
[Typescript]: https://www.typescriptlang.org/
[`tsc`]: https://www.typescriptlang.org/docs/handbook/compiler-options.html
[`tsc --module`]: https://www.typescriptlang.org/docs/handbook/compiler-options.html#module
[`tsc --strict`]: https://www.typescriptlang.org/docs/handbook/compiler-options.html#strict
[`tsc --types`]: https://www.typescriptlang.org/docs/handbook/compiler-options.html#types
