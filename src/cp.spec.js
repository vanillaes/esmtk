import { filesλobjects, setup, teardown, test } from './__tests__/test.js'
import { copyAsync, copyMultipleAsync, copyRecursiveAsync } from '@vanillaes/esmtk'
import { rmSync } from 'node:fs'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const files = require('./__tests__/cp.json')
const consoleError = console.error

setup(async (t) => {
  console.error = e => e
  process.chdir(process.cwd())
  rmSync('test', { recursive: true, force: true })

  t.end()
})

test('copyAsync - copy file-to-file', files.copyAsync, async (t) => {
  await copyAsync('cp1/test1.txt', 'cp2/test1.txt')

  const actual = filesλobjects()
  const expect = files.copyAsyncExpect

  t.deepEqual(actual, expect)
  t.end()
})

test('copyAsync - copy file-to-file - ERROR: no such file or directory (source)', files.copyAsync, async (t) => {
  const exitState = process.exitCode
  await copyAsync('cp1/test1.ts', 'cp2/test1.ts')

  const actual = process.exitCode
  const expect = 1

  process.exitCode = exitState
  t.equal(actual, expect)
  t.end()
})

test('copyAsync - copy file-to-file - ERROR: source is a directory', files.copyAsync, async (t) => {
  const exitState = process.exitCode
  await copyAsync('cp1/', 'cp2/test1.txt')

  const actual = process.exitCode
  const expect = 1

  process.exitCode = exitState
  t.equal(actual, expect)
  t.end()
})

test('copyAsync - copy file-to-directory', files.copyAsync, async (t) => {
  await copyAsync('cp1/test1.txt', 'cp2/')

  const actual = filesλobjects()
  const expect = files.copyAsyncExpect

  t.deepEqual(actual, expect)
  t.end()
})

test('copyAsync - copy file-to-directory - ERROR: no such file or directory (target)', files.copyAsync, async (t) => {
  const exitState = process.exitCode
  await copyAsync('cp1/test1.txt', 'cpx/')

  const actual = process.exitCode
  const expect = 1

  process.exitCode = exitState
  t.equal(actual, expect)
  t.end()
})

test('copyMultipleAsync - copy multiple files', files.copyMultipleAsync, async (t) => {
  await copyMultipleAsync(['cp1/test1.txt', 'cp1/test1.js'], 'cp2/')

  const actual = filesλobjects()
  const expect = files.copyMultipleAsyncExpect

  t.deepEqual(actual, expect)
  t.end()
})

test('copyMultipleAsync - copy multiple files - ERROR: no such file or directory (target)', files.copyMultipleAsync, async (t) => {
  const exitState = process.exitCode
  await copyMultipleAsync(['cp1/test1.txt', 'cp1/test1.js'], 'cpx/')

  const actual = process.exitCode
  const expect = 1

  process.exitCode = exitState
  t.equal(actual, expect)
  t.end()
})

test('copyRecursiveAsync - ', files.copyRecursiveAsync, async (t) => {
  await copyRecursiveAsync('cp1/', 'cp2/')

  const actual = filesλobjects()
  const expect = files.copyRecursiveAsyncExpect

  t.deepEqual(actual, expect)
  t.end()
})

teardown(async (t) => {
  console.error = consoleError
  process.chdir(process.cwd())
  rmSync('test', { recursive: true, force: true })

  t.end()
})
