const list = [
  {
    regex: /^clear$/,
    name: 'clear',
    description: 'Enter <em>clear</em> to clear the screen.'
  },
  {
    regex: /^edit .*$/,
    description:
      'Enter <em>edit my-game</em> to open <em>my-game</em> in the game editor.'
  },
  {
    regex: /^edit$/,
    output: () =>
      'Please specify the file you wish to edit, e.g. <em>edit my-game</em>.'
  },
  {
    regex: /^help$/,
    description: 'Enter <em>help</em> for help.'
  }
]

list[list.length - 1].output = () =>
  list
    .filter(d => d.description)
    .map(d => `<div>${d.description}</div>`)
    .join('')

const commands = {
  all: list,
  find: input => list.find(d => input.match(d.regex))
}

export default commands
