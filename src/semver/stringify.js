/**
 * Stringify a Version
 * @param {import("./version.js").Version} v Version number
 * @returns {string} The stringified version number
 */
export function stringify (v) {
  let output = `${v.major}.${v.minor}.${v.patch}`
  if (v.prerelease?.length) {
    output += `-${v.prerelease.join('.')}`
  }
  if (v.build?.length) {
    output += `+${v.build.join('.')}`
  }
  return output
}
