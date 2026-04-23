<h1 align="center">ECMAScript Module Toolkit</h1>

<div align="center">Essential tools for ECMAScript module development</div>

<br />

<div align="center">
  <a href="https://github.com/vanillaes/esmtk/releases"><img src="https://badgen.net/github/tag/vanillaes/esmtk?cache-control=no-cache" alt="GitHub Release"></a>
  <a href="https://npmjs.com/package/@vanillaes/esmtk"><img src="https://badgen.net/npm/dw/@vanillaes/esmtk?icon=npm" alt="NPM Weekly Downloads"></a>
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

`@vanillaes/esmtk init [...options]`

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

`es test [...options] [files]`

- `[files]` - File(s)/glob(s) to test (default: `**/*.spec.js`)
- `--cwd <dir>` - Current working directory
- `--ignore <pattern(s)>` - File(s)/glob(s) to ignore (default: `**/node_modules/**`)
- `--watch` - Watch for changes to the test(s)

### Usage

```sh
# run the tests
es test

# run the tests (using a different naming scheme)
es test **/*.test.js

# run the tests (ignore tests)
es test **/*.test.js --ignore **/node_modules/**,src/util.spec.js

# run the tests (change the current working directory)
es test **/*.test.js --cwd src/

# run the tests (watch for changes)
es test --watch
```


## Lint

Lint the source code ([Lint-ES][])

### Arguments

`es lint [...options]`

- `[files]` - File(s)/glob(s) to lint (default: `**/*.js`)
- `--cwd <dir>` - Current working directory
- `--fix` - Automatically fix problems
- `--ignore <pattern(s)>` - File(s)/glob(s) to ignore 

*Note: By default `lint-es` ignores `node_modules/`, `coverage/`, `vendor/`, `*.min.js`, hidden files, and files included in `.gitignore`.*

### Usage

```sh
# lint the sources
es lint

# lint the sources (change the current working directory)
es lint --cwd src/

# lint the sources and attempt to automatally fix the issues
es lint --fix lint

# lint the sources (ignore files)
es lint --ignore src/
```


## Type

Type check the JSDoc typings ([Typescript][])

### Arguments

`es type [...options] [entry]`

- `[entry]` - Entry-point for the source (default: `[entry-point].js`)
- `--module <type>` - Module resolution type (default `esnext`). See [`tsc`][]
- `--strict` - Enable 'strict mode' type checks. See [`tsc`][]
- `--types <type(s)>` - Specify type package names to include (ex `node` for `@types/node`). See [`tsc`][]

### Usage

```sh
# type check the sources
es type index.js

# type check the sources (with 'node' module resolution)
es type --module nodenext index.js

# type check the sources (with 'strict mode' enabled)
es type --strict index.js

# type check the sources (with '@types/node' typings included)
es type --types node index.js
```

**Note: Due to Typescript limitations, inline JSDoc typings will be ignored if typings (ie `*.d.ts` files) exist.**


## Bundle

Bundle the source code to an ECMAScript module ([ESBuild][])

### Arguments

`es bundle [...options] [input] [output]`

- `[input]` - Input source file path (default: `[entry-point].js`)
- `[output]` - Output bundle file path (default: `[entry-point].esm.js`)
- `--platform <target>` - Target platform (ex `neutral`). See [`esbuild --platform`][]

### Usage

```sh
# bundle ESM source -> ESM bundle
es bundle src/sample.js bundle.js

# bundle ESM source -> ESM bundle (includes Node-specific bindings)
es bundle --platform=node src/sample.js bundle.js
```


## Minify

Bundle and Minify the source code to an ECMAScript module ([ESBuild][])

### Arguments

`es minify [...options] [input] [output]`

- `[input]` - Input source file path (default: `[entry-point].js`)
- `[output]` - Output minified bundle file path (default: `[entry-point].min.js`)
- `--platform <target>` - Target platform (default: `neutral`). See [`esbuild --platform`][]
- `--sourcemap` - Generate a source map for the minified bundle. See [`esbuild --sourcemap`][]

### Usage

```sh
# bundle ESM source -> minified ESM bundle
es minify src/sample.js bundle.min.js

# bundle ESM source -> minified ESM bundle (includes Node-specific bindings)
es minify --platform=node src/sample.js bundle.min.js

# bundle ESM source -> minified ESM bundle (output a sourcemap)
es minify --sourcemap src/sample.js bundle.min.js
```


## Typings

Generate Type Declarations (.d.ts) from JSDoc ([Typescript][])

### Arguments

`es typings [options...] [entry]`

- `[entry]` - Entry-point for the source (default: `[entry-point].js`)
- `--module <type>` - Module resolution type (default `esnext`). See [`tsc`][]
- `--strict` - Enable 'strict mode' type checks. See [`tsc`][]
- `--types <type(s)>` - Specify type package names to include (ex `node` for `@types/node`). See [`tsc`][]

### Usage

```sh
# generate .d.ts files for all linked source files
es typings index.js

# generate .d.ts files for all linked source files (with 'node' module resolution)
es typings --module nodenext index.js

# generate .d.ts files for all linked source files (with 'strict mode' enabled)
es typings --strict index.js

# generate .d.ts files for all linked source files (with '@types/node' typings included)
es typings --types node index.js
```


## Clean

Clean up build artifacts

### Arguments

`es clean [...options]`

- `--bundle` - Clean bundled build artifacts (default: `**/*.esm.js`)
- `--minify` - Clean minified build artifacts (default: `**/*.min.js`)
- `--typings` - Clean typing artifacts (default: `**/*.d.ts`)
- `--custom [pattern]` - Clean based on a user-defined pattern

### Usage

```sh
# clean all build artifacts
es clean --bundle --minify --typings

# override default extension
es clean --bundle *.mjs

# define your own pattern
es clean --custom *.scss.css
```

**Note: The `clean` command automatically ignores the contents of `node_modules/`**


## Preview

Preview the package contents included during `npm publish`

### Arguments

`es preview [...options]`

- `--cwd <dir>` - Current working directory

### Usage

```sh
# preview the package contents
es preview

# preview the package contents (from another directory)
es preview --cwd some/other/dir
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

`es version [...options] [release]`

- `[release]` - `major` | `minor` | `patch` | `premajor` | `preminor` | `prepatch` | `prerelease` | `<version>`
- `--cwd <dir>` - Current working directory
- `--no-git-tag-version` - Tag the version in git? (default: true)
- `--message <message>` - Git commit message, `%s` will be replace with the version number (default: v%s)
- `--preid <id>` - Pre-release identifier (ex "rc" -> 1.2.0-rc.8)

### Usage

```sh
# Bump the major version
es version major

# Bump the minor version
es version major

# Bump the patch version
es version major

# Bump the patch version (change the current working directory)
es version patch --cwd src/

# Bump the patch version (don't tag the release in git)
es version patch --no-git-tag-version

# Bump the patch version (with a custom commit message on the tag)
es version patch --message "Release %s"

# Bump the patch version (add the prerelease id, ex "rc" -> 1.2.0-rc.8)
es version patch --preid rc
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
