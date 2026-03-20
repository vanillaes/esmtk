<h1 align="center">ECMAScript Module Toolkit</h1>

ESMTK, essential tools for ECMAScript module development

<div align="center">
  <a href="https://github.com/vanillaes/esmtk/releases"><img src="https://badgen.net/github/tag/vanillaes/esmtk" alt="GitHub Release"></a>
  <a href="https://www.npmjs.com/package/@vanillaes/esmtk"><img src="https://badgen.net/npm/v/@vanillaes/esmtk" alt="NPM Releases"></a>
  <a href="https://github.com/vanillaes/esmtk/actions"><img src="https://github.com/vanillaes/esmtk/workflows/Latest/badge.svg" alt="Latest Status"></a>
  <a href="https://github.com/vanillaes/esmtk/actions"><img src="https://github.com/vanillaes/esmtk/workflows/Release/badge.svg" alt="Release Status"></a>
</div>

## Lint

Lint the source code (using StandardJS)

### Arguments

`esmtk lint [--fix]`

- `--fix` - automatically fix problems

### Usage

```sh
esmtk lint
```

## Types

Type check the JSDoc typings (using Typescript)

### Arguments

`esmtk types index.js`

- `[entry]` - the entry-point for the source
- `--strict` - enable 'strict mode' type checks

### Usage

```sh
esmtk types index.js
```

## Typings

Generate Type Declarations (.d.ts) from JSDoc (using Typescript)

### Arguments

`esmtk typings index.js`

- `[entry]` - the entry-point for the source

### Usage

```sh
esmtk typings index.js
```

## Bundle

Bundle the source code to an ECMAScript module (using ESBuild)

### Arguments

`esmtk bundle [input] [output]`

- `[input]` - the input source file path
- `[output]` - the output bundle file path
- `--platform=<platform>` - target a specific platform (ex 'node')

### Usage

```sh
esmtk bundle src/sample.js bundle.js
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
esmtk minify src/sample.js bundle.min.js
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
esmtk commonjs src/sample.js bundle.cjs
```

## Copy

Copy is a cross-platform clone of the `cp` command in Linux

### Arguments

`esmtk cp [-r] [source...] [destination]`

- `[source...]` - the source file(s)/glob(s)
- `[destination]` - the destination file/directory
- `-r, --recursive` - copy files/directories recursively

### Usage

```sh
esmtk cp file1.txt dest/file1.txt
esmtk cp file1.txt file2.txt file3.txt dest/
esmtk cp *.txt dest/
esmtk cp *.txt *.js *.ts dest/
esmtk cp -r src/ dest/
```

## Remove

Remove is a cross-platform clone of the `rm` command in Linux

### Arguments

`esmtk rm [-r] [path(s)...]`

- `[path(s)...]` - the source file(s)/glob(s)
- `-r, --recursive` - remove directory recursively

### Usage

```sh
esmtk rm file1.txt
esmtk rm file1.txt file3.txt file3.txt
esmtk rm *.txt
esmtk rm *.txt *.js *.ts
esmtk rm -r src/
```