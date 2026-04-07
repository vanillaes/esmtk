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
 * @param {object} options 'init' options
 * @param {boolean} options.scripts Include ESMTK scripts?
 */
export async function init (options) {
  const npmExists = await which('npm')
  if (!npmExists) {
    console.error('npm not found')
    console.error('is node installed?')
    process.exitCode = 1
    return
  }

  const gitExists = await which('git')
  if (!gitExists) {
    console.error('git not found')
    console.error('is git installed?')
    process.exitCode = 1
    return
  }

  // defaults
  const DIR = process.cwd()
  const DIRNAME = basename(process.cwd())
  let REPOSITORY
  let USERNAME
  let EMAIL
  try {
    REPOSITORY = await fetchGitRepository()
    USERNAME = gitExists ? await fetchGitUser() : ''
    EMAIL = gitExists ? await fetchGitEmail() : ''
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
    } else {
      console.error(`Unexpected error: ${error}`)
    }
    process.exitCode = 1
    return
  }

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
  const keywords = await ask(program, 'keywords')
  if (keywords) {
    pkg.keywords = keywords.split(' ')
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
    pkg.exports['.'] = `./${entry}`
  }
  if (options?.scripts) {
    pkg.scripts = {}
    pkg.scripts.test = 'esmtk test'
    pkg.scripts.lint = 'esmtk lint'
    pkg.scripts.type = `esmtk type ${entry}`
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
  if (ok?.toLowerCase() === 'yes') {
    await writeFile('package.json', pkgString)
  } else {
    console.log('Aborted.')
  }
  program.close()
}

/**
 * Ask a question on the command-line
 * @private
 * @param {import('node:readline/promises').Interface} program reference to the CLI
 * @param {string} prompt the question to ask the User
 * @param {string} [defaultValue] the default value for the question
 * @returns {Promise<string | undefined>} the answer to the question | the default value
 */
async function ask (program, prompt, defaultValue) {
  const suffix = defaultValue ? `(${defaultValue}) ` : ''
  const answer = await program.question(`${prompt}: ${suffix}`)
  return answer || defaultValue
}

/**
 * Fetch the user.name from .gitconfig
 * @private
 * @returns {Promise<string>} the user.name
 */
async function fetchGitUser () {
  const { stdout, stderr } = await execAsync('git config --get user.name')
  if (stderr) {
    throw new Error(`exec error: ${stderr}`)
  }
  console.log(`${stdout}`.trim())
  return `${stdout}`.trim()
}

/**
 * Fetch the user.email from .gitconfig
 * @private
 * @returns {Promise<string>} the user.email
 */
async function fetchGitEmail () {
  const { stdout, stderr } = await execAsync('git config --get user.email')
  if (stderr) {
    throw new Error(`exec error: ${stderr}`)
  }
  console.log(`${stdout}`.trim())
  return `${stdout}`.trim()
}

/**
 * Fetch the repository name from .git/config
 * @private
 * @returns {Promise<string | undefined>} the repository name
 */
async function fetchGitRepository () {
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
