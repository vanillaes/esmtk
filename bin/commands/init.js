import { fileExists, which } from '../../src/index.js'
import { exec } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { stdin, stdout } from 'node:process'
import { createInterface } from 'node:readline/promises'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

/**
 * Create a package.json file for ECMAScript Development
 * @param {any} options init options
 */
export async function init (options) {
  const npmExists = await which('npm')
  if (!npmExists) {
    console.error('npm not found')
    console.error('is node installed?')
    process.exit(1)
  }

  const gitExists = await which('git')
  if (!gitExists) {
    console.error('git not found')
    console.error('is git installed?')
    process.exit(1)
  }

  // defaults
  const DIR = process.cwd()
  const DIRNAME = basename(process.cwd())
  const REPOSITORY = await getGitRepository()
  const USERNAME = gitExists ? await fetchGitUser() : ''
  const EMAIL = gitExists ? await fetchGitEmail() : ''

  const program = createInterface({ input: stdin, output: stdout })

  console.log('This utility will walk you through creating a package.json file.')
  console.log('It only covers the most common items, and tries to guess sensible defaults.')
  console.log()
  console.log('Press ^C at any time to quit.')
  console.log()

  const pkg = {}
  pkg.name = await ask(program, 'package name', DIRNAME)
  pkg.version = await ask(program, 'version', '0.0.0')
  pkg.description = await ask(program, 'description')
  let keywords = await ask(program, 'keywords')
  if (keywords) {
    keywords = keywords.split(' ')
    pkg.keywords = keywords
  }
  pkg.repository = await ask(program, 'git repository', REPOSITORY)
  const user = await ask(program, 'author', USERNAME)
  if (user !== '') {
    pkg.author = user
    const email = await ask(program, 'email', EMAIL)
    if (email !== '') {
      pkg.author += ` <${EMAIL}>`
    }
    const website = await ask(program, 'website')
    if (website) {
      pkg.author += ` (${website})`
    }
  }
  pkg.license = await ask(program, 'license', 'MIT')
  pkg.type = 'module'
  const entry = await ask(program, 'entry point', 'index.js')
  if (entry) {
    pkg.exports = {}
    pkg.exports['.'] = 'entry'
  }
  if (options?.scripts) {
    pkg.scripts = {}
    pkg.scripts.test = 'esmtk test'
    pkg.scripts.lint = 'esmtk lint'
    pkg.scripts.types = `esmtk types ${entry}`
    pkg.scripts.typings = `esmtk typings ${entry}`
    pkg.scripts.clean = 'esmtk clean --typings'
    pkg.scripts.preview = 'esmtk preview'
  } else {
    pkg.scripts = {}
    pkg.scripts.test = await ask(program, 'test command')
  }
  const pkgString = JSON.stringify(pkg, null, 2) + '\n'
  console.log()
  console.log(`About to write to ${join(DIR, 'package.json')}:`)
  console.log(pkgString)

  const ok = await ask(program, 'is this OK', 'yes')
  if (ok.toLowerCase() === 'yes') {
    await writeFile('package.json', pkgString)
  } else {
    console.log('Aborted.')
  }
  program.close()
}

async function ask (program, prompt, defaultValue) {
  const suffix = defaultValue ? `(${defaultValue}) ` : ''
  const answer = await program.question(`${prompt}: ${suffix}`)
  return answer || defaultValue
}

async function fetchGitUser () {
  const { stdout, stderr } = await execAsync('git config --get user.name')
  if (stderr) {
    console.error(`exec error: ${stderr}`)
    process.exit(1)
  }
  console.log(`${stdout}`.trim())
  return `${stdout}`.trim()
}

async function fetchGitEmail () {
  const { stdout, stderr } = await execAsync('git config --get user.email')
  if (stderr) {
    console.error(`exec error: ${stderr}`)
    process.exit(1)
  }
  console.log(`${stdout}`.trim())
  return `${stdout}`.trim()
}

async function getGitRepository () {
  const config = join(process.cwd(), '.git', 'config')
  const exists = await fileExists(config)
  if (!exists) {
    return
  }
  const contents = await readFile(config, 'utf-8')
  const match = contents.match(/^\turl\s=\shttps:\/\/.*$/gm)
  if (match) {
    return match[0].replace('\turl = ', '')
  }
}
