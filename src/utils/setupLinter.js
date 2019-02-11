import * as acorn from 'acorn'
import * as walk from 'acorn-walk'

const parseOptions = {
  ecmaVersion: 9,
  sourceType: 'script',
  locations: true
}

class InvalidTokenError extends Error {
  constructor({ loc, raisedAt, message }) {
    super(message)
    this.name = 'InvalidTokenError'
    this.loc = loc
    this.raisedAt = raisedAt
  }
}

const findInvalidNode = nodes => {
  return new Promise(resolve => {
    const channel = new window.MessageChannel()
    const payload = {
      type: 'findInvalidToken',
      tokens: nodes.map(d => d.name)
    }
    const iframe = document.querySelector('iframe')
    iframe.contentWindow.postMessage(payload, '*', [channel.port2])
    channel.port1.onmessage = message => {
      resolve(nodes[message.data])
    }
  })
}

const getLintErrors = async ({ text }) => {
  const errors = []
  try {
    const parsed = acorn.parse(text, parseOptions)
    let nodes = []
    walk.simple(parsed, {
      Identifier(node) {
        nodes.push(node)
      }
    })
    const node = await findInvalidNode(nodes)
    if (node) {
      const error = {
        loc: node.loc.start,
        raisedAt: node.end,
        message: `${node.name} is not allowed in SCRIPT-8.`
      }
      throw new InvalidTokenError(error)
    }
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
