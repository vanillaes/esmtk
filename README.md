<h1 align="center">ECMAScript Module Toolkit</h1>

<div align="center">ESMTK, essential tools for ECMAScript module development</div>

<br />

<div align="center">
  <a href="https://github.com/vanillaes/esmtk/releases"><img src="https://badgen.net/github/tag/vanillaes/esmtk?cache-control=no-cache" alt="GitHub Release"></a>
  <a href="https://www.npmjs.com/package/@vanillaes/esmtk"><img src="https://badgen.net/npm/v/@vanillaes/esmtk?icon=npm" alt="NPM Version"></a>
  <a href="https://www.npmjs.com/package/@vanillaes/esmtk"><img src="https://badgen.net/npm/dm/@vanillaes/esmtk?icon=npm" alt="NPM Downloads"></a>
  <a href="https://github.com/vanillaes/esmtk/actions"><img src="https://github.com/vanillaes/esmtk/workflows/Latest/badge.svg" alt="Latest Status"></a>
  <a href="https://github.com/vanillaes/esmtk/actions"><img src="https://github.com/vanillaes/esmtk/workflows/Release/badge.svg" alt="Release Status"></a>
</div>

## Commands

- [init](#init) - Create a package.json file for ECMAScript module development
- [test](#test) - Run tests (using Tape-ES)
- [lint](#lint) - Lint the source code (using Lint-ES)
- [type](#type) - Type check the JSDoc typings (using Typescript)
- [bundle](#bundle) - Bundle the source code to an ECMAScript module (using ESBuild)
- [minify](#minify) - Bundle and Minify the source code to an ECMAScript module (using ESBuild)
- [typings](#typings) - Generate Type Declarations (.d.ts) from JSDoc (using Typescript)
- [clean](#clean) - Clean up build artifacts
- [preview](#preview) - Preview the package contents included during `npm publish`
- [cp](#cp) - A cross-platform clone of the `cp` command in Linux
- [rm](#rm) - A cross-platform clone of the `rm` command in Linux


## Init

Create a package.json file for ECMAScript module development

### Arguments

`esmtk init [...options]`

- `--scripts` - Include ESMTK scripts?

### Usage

```sh
# init package.json
npx @vanillaes/esmtk init

# init package.json (including ESMTK scripts)
npx @vanillaes/esmtk init --scripts
```


## Test

Run tests (using Tape-ES)

### Arguments

`esmtk test [...options] [glob]`

- `[glob]` - Glob(s) used to locate test files (default: `**/*.spec.js`)
- `--cwd` - The current working directory (default `process.cwd()`)
- `--ignore` - Glob(s) to ignore (default `**/node_modules/**`)
- `--watch` - Watch for changes to the test(s)

### Usage

```sh
# run the tests
esmtk test

# run the tests (using a different naming scheme)
esmtk test **/*.test.js

# run the tests (ignore tests)
esmtk test **/*.test.js --ignore **/node_modules/**,src/rm.spec.js

# run the tests (change the current working directory)
esmtk test **/*.test.js --cwd src/

# run the tests (watch for changes)
esmtk test --watch
```


## Lint

Lint the source code (using Lint-ES)

### Arguments

`esmtk lint [...options]`

- `--cwd` - Current working directory (default `process.cwd()`)
- `--fix` - Automatically fix problems
- `--ignore` - File(s) to ignore

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

Type check the JSDoc typings (using Typescript)

### Arguments

`esmtk type [...options] [entry]`

- `[entry]` - Entry-point for the source (default: `[entry-poiont].js`)
- `--module` - Module resolution type (default `esnext`)
- `--strict` - Enable 'strict mode' type checks
- `--types` - Specify type package names to include (ex `node` for `@types/node`)

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

**Node: Due to Typescript limitations, inline JSDoc typings will be ignored if typings (ie `*.d.ts` files) exist.**


## Bundle

Bundle the source code to an ECMAScript module (using ESBuild)

### Arguments

`esmtk bundle [...options] [input] [output]`

- `[input]` - Input source file path (default: `[entry-poiont].js`)
- `[output]` - Output bundle file path (default: `[entry-point].esm.js`)
- `--platform=<platform>` - Target platform (ex `node`)

### Usage

```sh
# bundle ESM source -> ESM bundle
esmtk bundle src/sample.js bundle.js

# bundle ESM source -> ESM bundle (includes Node-specific bindings)
esmtk bundle --platform=node src/sample.js bundle.js
```


## Minify

Bundle and Minify the source code to an ECMAScript module (using ESBuild)

### Arguments

`esmtk minify [...options] [input] [output]`

- `[input]` - Input source file path (default: `[entry-poiont].js`)
- `[output]` - Output minified bundle file path (default: `[entry-poiont].min.js`)
- `--platform=<platform>` - Target platform (ex `node`)
- `--sourcemap` - Generate a source map for the minified bundle

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

Generate Type Declarations (.d.ts) from JSDoc (using Typescript)

### Arguments

`esmtk typings [options...] [entry]`

- `[entry]` - Entry-point for the source (default: `[entry-poiont].js`)
- `--module` - Module resolution type (default `esnext`)
- `--types` - Specify type package names to include (ex `node` for `@types/node`)

### Usage

```sh
# generate .d.ts files for all linked source files
esmtk typings index.js

# generate .d.ts files for all linked source files (with 'node' module resolution)
esmtk typings --module nodenext index.js

# generate .d.ts files for all linked source files (with '@types/node' typings included)
esmtk typings --types node index.js
```


## Clean

Clean up build artifacts

### Arguments

`esmtk clean [...options] [cwd]`

- `[cwd]` - Current working directory (default: `process.cwd()`)
- `--bundle` - Clean bundled build artifacts (default: `**/*.esm.js`)
- `--minify` - Clean minified build artifacts (default: `**/*.min.js`)
- `--typings` - Clean typing artifacts (default: `**/*.d.ts`)
- `--custom` - Clean based on a user-defined pattern

### Usage

```sh
# clean all build artifacts
esmtk clean --bundle --minify --typings

# override default extension
esmtk clean --bundle *.mjs

# define your own pattern
esmtk clean --custom *.scss.css
```

**Node: The `clean` command automatically ignores the contents of `node_modules/`**


## Preview

Preview the package contents included during `npm publish`

### Arguments

`esmtk preview [...options]`

- `--cwd` - Current working directory

### Usage

```sh
# preview the package contents
esmtk preview

# preview the package contents (from another directory)
esmtk preview --cwd some/other/dir
```


## CP

A cross-platform clone of the `cp` command in Linux

### Arguments

`esmtk cp [...options] [source...] [destination]`

- `[source...]` - Source file(s)/glob(s)
- `[destination]` - The destination file/directory
- `-r, --recursive` - Copy file(s)/directorie(s) recursively

### Usage

```sh
# copy one file
esmtk cp file1.txt dest/file1.txt

# copy multiple files
esmtk cp file1.txt file2.txt file3.txt dest/

# copy files that match a glob
esmtk cp *.txt dest/

# copy files that match multiple globs
esmtk cp *.txt *.js *.ts dest/

# recursively copy files from one directory to another
esmtk cp -r src/ dest/
```


## RM

A cross-platform clone of the `rm` command in Linux

### Arguments

`esmtk rm [...options] [paths...]`

- `[paths...]` - the source file(s)/glob(s)
- `-r, --recursive` - remove directory recursively

### Usage

```sh
# remove one file
esmtk rm file1.txt

# remove multiple files
esmtk rm file1.txt file3.txt file3.txt

# remove files that match a glob
esmtk rm *.txt

# remove files that match miltiple globs
esmtk rm *.txt *.js *.ts

# recursively remove a 
esmtk rm -r src/
```