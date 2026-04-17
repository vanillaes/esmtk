/**
 * File Access Error
 */
export class EACCESError extends Error {
  /**
   * @param {string} [message] the error message
   */
  constructor (message) {
    super(message)
    this.name = 'EACCESError'
    this.code = 'EACCES'
  }
}
