/* @ts-self-types="./index.d.ts" */
export { EACCESError } from './errors.js'
export { gitUserEmail, gitUserName, gitSync, isGitRepo, readGitIgnore, Repository } from './git/index.js'
export { JSR } from './jsr.js'
export { installed, Package, PackageLock, RawPackage, readNPMIgnore, runScript } from './npm/index.js'
export { execAsync, exists, fileExists, match, matchAll, which } from './util.js'
