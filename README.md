<h1 align="center">ECMAScript Module Toolkit</h1>

ESMTK, essential tools for ECMAScript module development

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
- [lint](#lint) - Lint the source code (using StandardJS)
- [types](#lint) - Type check the JSDoc typings (using Typescript)
- [bundle](#bundle) - Bundle the source code to an ECMAScript module (using ESBuild)
- [minify](#minify) - Bundle and Minify the source code to an ECMAScript module (using ESBuild)
- [commonjs](#commonjs) - Bundle the source code to a CommonJS module (using ESBuild)
- [typings](#typings) - Generate Type Declarations (.d.ts) from JSDoc (using Typescript)
- [clean](#clean) - Clean up build artifacts
- [cp](#cp) - A cross-platform clone of the `cp` command in Linux
- [rm](#rm) - A cross-platform clone of the `rm` command in Linux


## Init

Create a package.json file for ECMAScript module development

### Arguments

`esmtk init`

### Usage

```sh
# init package.json
npx @vanillaes/esmtk init
```


## Test

Run tests (using Tape-ES)

### Arguments

`esmtk test [glob]`

- `[glob]` - the glob used to locate test files (default: `**/*.spec.js`)
- `-i` | `--ignore` - the ignore matcher pattern (default `**/node_modules/**`)
- `--watch` - watch for changes to the tests

### Usage

```sh
# run the tests
npx @vanillaes/esmtk test

# run the tests (using a different naming scheme)
npx @vanillaes/esmtk test **/*.test.js

# run the tests (ignore tests)
npx @vanillaes/esmtk test **/*.test.js --ignore **/node_modules/**,src/rm.spec.js

# run the tests (watch for changes)
npx @vanillaes/esmtk test --watch
```


## Lint

Lint the source code (using StandardJS)

### Arguments

`esmtk lint [--fix]`

- `--fix` - automatically fix problems

### Usage

```sh
# lint the sources
esmtk lint

# lint the sources and attempt to automatally fix the issues
esmtk --fix lint
```


## Types

Type check the JSDoc typings (using Typescript)

### Arguments

`esmtk types [entry]`

- `[entry]` - the entry-point for the source
- `--strict` - enable 'strict mode' type checks

### Usage

```sh
# type check the sources
esmtk types index.js

# type check the sources (with 'strict mode' enabled)
esmtk types --strict index.js
```

**Node: Due to Typescript limitations, inline JSDoc typings will be ignored if typings (ie `*.d.ts` files) exist.**


## Bundle

Bundle the source code to an ECMAScript module (using ESBuild)

### Arguments

`esmtk bundle [input] [output]`

- `[input]` - the input source file path
- `[output]` - the output bundle file path
- `--platform=<platform>` - target a specific platform (ex 'node')

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

`esmtk minify [input] [output]`

- `[input]` - the input source file path
- `[output]` - the output bundle file path
- `--platform=<platform>` - target a specific platform (ex 'node')
- `--sourcemap` - generate a source map for the minified bundle

### Usage

```sh
# bundle ESM source -> minified ESM bundle
esmtk minify src/sample.js bundle.min.js

# bundle ESM source -> minified ESM bundle (includes Node-specific bindings)
esmtk minify --platform=node src/sample.js bundle.min.js

# bundle ESM source -> minified ESM bundle (output a sourcemap)
esmtk minify --sourcemap src/sample.js bundle.min.js
```


## CommonJS

Bundle the source code to a CommonJS module (using ESBuild)

### Arguments

`esmtk commonjs [input] [output]`

- `[input]` - the input source file path
- `[output]` - the output bundle file path
- `--platform=<platform>` - target a specific platform (ex 'node')

### Usage

```sh
# bundle ESM source -> CommonJS bundle
esmtk commonjs src/sample.js bundle.cjs

# bundle ESM source -> CommonJS bundle (includes Node-specific bindings)
esmtk commonjs --platform=node src/sample.js bundle.cjs
```


## Typings

Generate Type Declarations (.d.ts) from JSDoc (using Typescript)

### Arguments

`esmtk typings [entry]`

- `[entry]` - the entry-point for the source

### Usage

```sh
# generate .d.ts files for all linked source files
esmtk typings index.js
```


## Clean

Clean up build artifacts

### Arguments

`esmtk clean [root]`

- `[root]` - the root directory to perform the cleanup (default: `process.cwd()`)
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


## CP

A cross-platform clone of the `cp` command in Linux

### Arguments

`esmtk cp [-r] [source...] [destination]`

- `[source(s)...]` - the source file(s)/glob(s)
- `[destination]` - the destination file/directory
- `-r, --recursive` - copy files/directories recursively

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

`esmtk rm [-r] [path(s)...]`

- `[path(s)...]` - the source file(s)/glob(s)
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