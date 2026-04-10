import { filesλobjects, setup, teardown, test } from './__tests__/test.js'
import { cleanAsync, exists, match } from '@vanillaes/esmtk'
import { rmSync } from 'node:fs'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const files = require('./__tests__/util.json')

setup(async (t) => {
  process.chdir(process.cwd())
  rmSync('test', { recursive: true, force: true })

  t.end()
})

test('cleanAsync - remove multiple files', files.cleanAsync, async (t) => {
  await cleanAsync(['test1.txt', 'test1.js'])

  const actual = filesλobjects()
  const expect = files.cleanAsyncExpect

  t.deepEqual(actual, expect)
  t.end()
})

test('exists #1 - test to see if a file exists', files.exists, async (t) => {
  const actual = await exists('test1.txt')
  const expect = true

  t.equal(actual, expect)

  t.end()
})

test('exists #2 - test to see if a file does not exist', files.exists, async (t) => {
  const actual = await exists('test1.ts')
  const expect = false

  t.equal(actual, expect)

  t.end()
})

test('match #1 - match a file', files.match, async (t) => {
  const expect = ['test1.txt', 'test2.txt']
  const actual = await match('*.txt')

  t.deepEqual(actual, expect)
  t.end()
})

teardown(async (t) => {
  process.chdir(process.cwd())
  rmSync('test', { recursive: true, force: true })

  t.end()
})
