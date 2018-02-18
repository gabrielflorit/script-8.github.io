import * as acorn from 'acorn'

const setupLinter = () => {
  window.CodeMirror.registerHelper('lint', 'javascript', text => {
    const errors = []

    try {
      acorn.parse(text)
    } catch (e) {
      errors.push({
        from: {
          line: e.loc.line - 1,
          ch: e.loc.column
        },
        to: {
          line: e.loc.line - 1,
          ch: e.raisedAt
        },
        message: e.message.replace(/ \(\d+:\d+\)$/, ''),
        severity: 'error'
      })
    }

    return errors
  })
}

export default setupLinter
