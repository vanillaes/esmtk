/**
 * File Access Error
 */
export class EACCESError extends Error {
  /**
   * @param {string} [message] Error message
   */
  constructor (message) {
    super(message)
    this.name = 'EACCESError'
    this.code = 'EACCES'
  }
}

export class ValidationError extends Error {
  /**
   * @param {string} message Error message
   */
  constructor (message) {
    super(message)
    this.name = 'ValidationError'
    this.code = 'INVALID_FORMAT'
  }
}
