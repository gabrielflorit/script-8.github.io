import * as acorn from 'acorn'
import * as walk from 'acorn/dist/walk'
import _ from 'lodash'

const parseOptions = {
  ecmaVersion: 7,
  sourceType: 'script',
  locations: true
}

class InvalidTokenError extends Error {
  constructor ({ loc, raisedAt, message }) {
    super(message)
    this.name = 'InvalidTokenError'
    this.loc = loc
    this.raisedAt = raisedAt
  }
}

const getLintErrors = ({
  text,
  validateToken = _.get(window, 'frames[0].__script8.validateToken', null)
}) => {
  const errors = []
  try {
    const parsed = acorn.parse(text, parseOptions)
    walk.simple(parsed, {
      Identifier (node) {
        if (validateToken) {
          const isValidToken = validateToken(node.name)
          if (!isValidToken) {
            const error = {
              loc: node.loc.start,
              raisedAt: node.end,
              message: `${node.name} is not allowed in SCRIPT-8`
            }
            throw new InvalidTokenError(error)
          }
        }
      }
    })
  } catch (error) {
    errors.push({
      from: {
        line: error.loc.line - 1,
        ch: error.loc.column
      },
      to: {
        line: error.loc.line - 1,
        ch: error.raisedAt
      },
      message: error.message.replace(/ \(\d+:\d+\)$/, ''),
      severity: 'error'
    })
  }

  return errors
}

const setupLinter = () => {
  window.CodeMirror.registerHelper('lint', 'javascript', text =>
    getLintErrors({ text })
  )
}

export { parseOptions, getLintErrors }
export default setupLinter
