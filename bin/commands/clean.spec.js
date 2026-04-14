import { filesλobjects, setup, teardown, test } from './__tests__/test.js'
import { cleanAsync } from './clean.js'
import { rmSync } from 'node:fs'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const files = require('./__tests__/clean.json')

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

teardown(async (t) => {
  process.chdir(process.cwd())
  rmSync('test', { recursive: true, force: true })

  t.end()
})
