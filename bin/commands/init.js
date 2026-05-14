import { which } from '../../src/util.js'
import { Repository } from '../../src/git/repository.js'
import { gitUserEmail, gitUserName } from '../../src/git/utils.js'
import { writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { stdin, stdout } from 'node:process'
import { createInterface } from 'node:readline/promises'

/**
 * Create a package.json file for ECMAScript Development
 * @param {object} [options] 'init' options
 * @param {boolean} [options.scripts] Include ESMTK scripts?
 */
export async function init (options = {}) {
  const {
    scripts
  } = options

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
  const REPOSITORY = Repository.url()
  const USERNAME = gitUserName()
  const EMAIL = gitUserEmail()

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
  if (scripts) {
    pkg.scripts = {}
    pkg.scripts.test = 'esmtk test'
    pkg.scripts.lint = 'esmtk lint'
    pkg.scripts.type = 'esmtk type'
    pkg.scripts.typings = 'esmtk typings'
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
