export function preflight () {
  const match = process.version.match(/v(\d+)\.(\d+)/)
  const major = parseInt(match[1], 10)
  const minor = parseInt(match[2], 10)

  if (major === 13 && minor < 12) {
    console.error('For Node 13.x, 13.12 or greater is required')
    process.exit(1)
  }
}
