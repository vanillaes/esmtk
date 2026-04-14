import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import tapeTest from 'tape'

export async function setup (fn) {
  tapeTest('Setup', function (t) {
    fn(t)
  })
}

export const skip = () => tapeTest.skip()

export async function teardown (fn) {
  tapeTest('Teardown', function (t) {
    fn(t)
  })
}

export async function test (description, files = [], fn) {
  if (!files) {
    tapeTest(description, function (t) {
      fn(t)
    })
    return
  }

  tapeTest(description, function (t) {
    mkdirSync('test', { recursive: true })
    process.chdir('test')

    objectsλFiles(files)

    const oldEnd = t.end
    t.end = function () {
      oldEnd()
      process.chdir('..')
      rmSync('test', { recursive: true, force: true })
    }

    fn(t)
  })
}

export function objectsλFiles (obj, path = process.cwd()) {
  if (obj !== null && typeof obj === 'object') {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        mkdirSync(join(path, key), { recursive: true })
        objectsλFiles(value, join(path, key))
      } else {
        writeFileSync(join(path, key), value)
      }
    })
  }
}

export function filesλobjects (dir = '.') {
  function walk (dir, fileList = []) {
    const files = readdirSync(dir)
    for (const file of files) {
      const filePath = join(dir, file)
      const stat = statSync(filePath)
      if (stat.isDirectory()) {
        walk(filePath, fileList)
      } else if (stat.isFile()) {
        fileList.push(filePath)
      }
    }
    return fileList
  }

  function treeify (files) {
    const tree = {}
    for (const path of files) {
      const parts = path.split('/')
      let currentLevel = tree
      parts.forEach((part, index, array) => {
        if (index === array.length - 1) {
          const contents = readFileSync(path, 'utf8')
          currentLevel[part] = contents
        } else {
          if (!currentLevel[part]) {
            currentLevel[part] = {}
          }
          currentLevel = currentLevel[part]
        }
      })
    }
    return tree
  }

  const files = walk(dir).reverse()
  const tree = treeify(files)

  return tree
}
