import fs from 'fs'
import path from 'path'
import os from 'os'
import glob from 'glob'

export async function cp (opt) {
  const self = this
  const options = {}
  options.noclobber = opt.force === true ? false : opt.noclobber
  options.recursive = opt.R === true ? true : opt.recursive

  const dest = opt.args.pop()

  let sources = opt.args
  const exists = fs.existsSync(dest)
  const stats = exists && fs.statSync(dest)

  // Dest is not existing dir, but multiple sources given
  if ((!exists || !stats.isDirectory()) && sources.length > 1) {
    console.error(`cp: target ${dest} is not a directory`)
    process.exit(1)
  }

  // Dest is an existing file, but no -f given
  if (exists && stats.isFile() && options.noclobber) {
    process.exit(0)
  }

  if (options.recursive) {
    sources = sources.reduce((acc, src) => {
      if (src.endsWith('/')) {
        return [...acc, `${src}*`]
      }
      if (fs.statSync(src).isDirectory() && !exists) {
        return [...acc, `${src}/*`]
      }
      return [...acc, src]
    }, [])

    try {
      fs.mkdirSync(dest, parseInt('0777', 8))
    } catch (e) {
      // like Unix's cp, keep going even if we can't create dest dir
    }
  }
  sources = sources.reduce((acc, curr) => {
    return [...acc, ...glob.sync(curr)]
  }, [])

  sources.forEach(function (src) {
    if (!fs.existsSync(src)) {
      console.error(`cp: cannot stat ${src}: No such file or directory`)
      return
    }

    if (fs.statSync(src).isDirectory()) {
      if (!options.recursive) {
        console.log(`cp: -r not specified; omitting directory ${src}`)
      } else {
        // 'cp /a/source dest' should create 'source' in 'dest'
        const newDest = path.join(dest, path.basename(src))
        const checkDir = fs.statSync(src)
        try {
          fs.mkdirSync(newDest, checkDir.mode)
        } catch (e) {
          if (e.code !== 'EEXIST') {
            throw new Error()
          }
        }
        cpdirSyncRecursive.call(self, src, newDest, options)
      }
      return
    }

    // If here, src is a file
    // When copying to '/path/dir', iDest = '/path/dir/file1'
    let iDest = dest
    if (fs.existsSync(dest) && fs.statSync(dest).isDirectory()) {
      iDest = path.normalize(`${dest}/${path.basename(src)}`)
    }

    if (fs.existsSync(iDest) && options.no_force) {
      return
    }

    copyFileSync.call(self, src, iDest)
  })
}

function cpdirSyncRecursive (sourceDir, destDir, options) {
  const self = this
  if (!options) {
    options = {}
  }
  const checkDir = fs.statSync(sourceDir)
  try {
    fs.mkdirSync(destDir, checkDir.mode)
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e
    }
  }
  const files = fs.readdirSync(sourceDir)
  for (let i = 0; i < files.length; i++) {
    const srcFile = `${sourceDir}/${files[i]}`
    const destFile = `${destDir}/${files[i]}`
    const srcFileStat = fs.lstatSync(srcFile)
    if (srcFileStat.isDirectory()) {
      // recursion this thing right on back.
      cpdirSyncRecursive.call(self, srcFile, destFile, options)
    } else if (srcFileStat.isSymbolicLink()) {
      const symlinkFull = fs.readlinkSync(srcFile)
      fs.symlinkSync(symlinkFull, destFile, os.platform() === 'win32' ? 'junction' : null)
      // At this point, we've hit a file actually worth copying... so copy it on over.
    } else if (fs.existsSync(destFile) && options.noclobber) {
      // be silent
    } else {
      copyFileSync.call(self, srcFile, destFile)
    }
  }
}

function copyFileSync (src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`cp: cannot stat ${src}: No such file or directory`)
    return
  }

  const BUF_LENGTH = 64 * 1024
  const buf = Buffer.alloc(BUF_LENGTH)
  let bytesRead = BUF_LENGTH
  let pos = 0
  let fdr = null
  let fdw = null

  try {
    fdr = fs.openSync(src, 'r')
  } catch (e) {
    console.error(`cp: cannot open ${src}: ${e.code}`)
    return
  }

  try {
    fdw = fs.openSync(dest, 'w')
  } catch (e) {
    console.error(`cp: cannot write to destination file ${dest}: ${e.code}`)
    return
  }

  while (bytesRead === BUF_LENGTH) {
    bytesRead = fs.readSync(fdr, buf, 0, BUF_LENGTH, pos)
    fs.writeSync(fdw, buf, 0, bytesRead)
    pos += bytesRead
  }

  fs.closeSync(fdr)
  fs.closeSync(fdw)
  fs.chmodSync(dest, fs.statSync(src).mode)
}
