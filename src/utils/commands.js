const commands = {
  tab: cm => {
    const spaces = Array(cm.getOption('indentUnit') + 1).join(' ')
    cm.replaceSelection(spaces)
  },
  comment: cm => {
    cm.toggleComment()
  }
}

export default commands
