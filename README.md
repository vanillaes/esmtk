<h1 align="center">ES Module Toolkit</h1>

ESMTK, essential tools and libs for ES module development

[![GitHub Releases](https://badgen.net/github/tag/vanillaes/esmtk)](https://github.com/vanillaes/esmtk/releases)
[![NPM Release](https://badgen.net/npm/v/esmtk)](https://www.npmjs.com/package/esmtk)
[![Latest Status](https://github.com/vanillaes/esmtk/workflows/Latest/badge.svg)](https://github.com/vanillaes/esmtk/actions)
[![Release Status](https://github.com/vanillaes/esmtk/workflows/Release/badge.svg)](https://github.com/vanillaes/esmtk/actions)


## Lint

Lint uses StandardJS to lint the source

### Arguments

`esmtk lint [--fix]`

- `--fix` - automatically fix problems

### Usage

```sh
esmtk lint
```

## Bundle

Bundle uses ESBuild to compile an ES module (and its deps) into a bundle

### Arguments

`esmtk bundle [input] [output]`

- `[input]` - the input source file path
- `[output]` - the output bundle file path

### Usage

```sh
esmtk bundle src/sample.js bundle.js
```

## Minify

Minify uses ESBuild to compile an ES module (and its deps) into a minified bundle

### Arguments

`esmtk minify [input] [output]`

- `[input]` - the input source file path
- `[output]` - the output bundle file path

### Usage

```sh
esmtk minify src/sample.js bundle.min.js
```

## CommonJS

CommonJS uses ESBuild to compile an ES module (and its deps) into a CommonJS bundle

### Arguments

`esmtk commonjs [input] [output]`

- `[input]` - the input source file path
- `[output]` - the output bundle file path

### Usage

```sh
esmtk commonjs src/sample.js bundle.cjs
```

## Copy

Copy us a cross-platform clone of the `cp` command in Linux

### Arguments

`esmtk cp -rf [source] [destination]`

- `[source]` - the source file/glob
- `[destination]` - the destination file/directory
- `-r, --recursive` - copy files/directories recursively
- `-f --force` - force overwrite existing files

### Usage

```sh
esmtk cp src/* dest/
```

-----

# API Documentation

## preflight()

Verify the node meets the minimum version

### Usage

```javascript
import { preflight } from 'node_modules/esmtk'

preflight()
```