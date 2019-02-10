import prettier from 'prettier/standalone'
import prettierParser from 'prettier/parser-babylon'

const commands = {
  tab: cm => {
    const spaces = Array(cm.getOption('indentUnit') + 1).join(' ')
    cm.replaceSelection(spaces)
  },
  comment: cm => {
    cm.toggleComment()
  },
  format: (cm, setContents) => {
    const oldCode = cm.getValue()
    const index = cm.indexFromPos(cm.getCursor())

    const prettierOpts = cursorOffset => ({
      parser: 'babel',
      plugins: {
        babel: prettierParser
      },
      cursorOffset,
      semi: false,
      singleQuote: true
    })

    const { formatted, cursorOffset } = prettier.formatWithCursor(
      oldCode,
      prettierOpts(index)
    )

    setContents(formatted)

    const newCursor = cm.posFromIndex(cursorOffset)
    cm.setCursor(newCursor)
  }
}

export default commands
