import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import tapeTest from 'tape'

export async function test (description, files, fn) {
  tapeTest(description, function (t) {
    mkdirSync('test', { recursive: true })
    process.chdir('test')
    for (const [name, contents] of Object.entries(files)) {
      writeFileSync(name, contents)
    }

    const oldEnd = t.end
    t.end = function () {
      oldEnd()
      process.chdir('..')
      rmSync('test', { recursive: true, force: true })
    }

    fn(t)
  })
}

export const skip = () => tapeTest.skip()
