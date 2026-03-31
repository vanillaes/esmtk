import { filesλobjects, setup, teardown, test } from './__tests__/test.js'
import { removeAsync, removeMultipleAsync, removeRecursiveAsync } from '@vanillaes/esmtk'
import { rmSync } from 'node:fs'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const files = require('./__tests__/rm.json')
const processExit = process.exit

setup(async (t) => {
  process.exit = function () {
    throw new Error('process.exit')
  }
  process.chdir(process.cwd())
  rmSync('test', { recursive: true, force: true })

  t.end()
})

test('removeAsync - remove a file', files.removeAsync, async (t) => {
  await removeAsync('test1.txt')

  const actual = filesλobjects()
  const expect = files.removeAsyncExpect

  t.deepEqual(actual, expect)
  t.end()
})

test('removeAsync - ERROR: no such file or directory', files.removeAsync, async (t) => {
  await removeAsync('test1.ts')

  const actual = process.exitCode
  const expect = 1

  t.equal(actual, expect)
  t.end()
})

test('removeAsync - ERROR: file is a directory', files.removeAsync, async (t) => {
  await removeAsync('directory/')

  const actual = process.exitCode
  const expect = 1

  t.equal(actual, expect)
  t.end()
})

test('removeMultipleAsync - remove multiple files', files.removeMultipleAsync, async (t) => {
  await removeMultipleAsync(['test1.txt', 'test1.js'])

  const actual = filesλobjects()
  const expect = files.removeMultipleAsyncExpect

  t.deepEqual(actual, expect)
  t.end()
})

test('removeRecursiveAsync - ', files.removeRecursiveAsync, async (t) => {
  await removeRecursiveAsync('directory1')

  const actual = filesλobjects()
  const expect = files.removeRecursiveAsyncExpect

  t.deepEqual(actual, expect)
  t.end()
})

teardown(async (t) => {
  process.exit = processExit
  process.chdir(process.cwd())
  rmSync('test', { recursive: true, force: true })

  t.end()
})
