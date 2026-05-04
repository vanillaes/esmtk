/* @ts-self-types="./index.d.ts" */
export { EACCESError } from './errors.js'
export { gitAdd, gitCommit, gitLatestRelease, gitTag, isGitRepo, isGitWorkingTreeClean } from './git.js'
export { JSR } from './jsr.js'
export { Package, PackageLock, RawPackage, runScript } from './npm/index.js'
export { exists, fileExists, installed, match, matchAll, readGitIgnore, readNPMIgnore, which } from './util.js'
