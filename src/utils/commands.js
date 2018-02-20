const list = [
  {
    regex: /^clear$/i,
    name: 'clear',
    description: 'Enter <em>clear</em> to clear the screen.'
  },
  {
    // regex: /^edit (.*)$/,
    regex: /^editor$/i,
    name: 'editor',
    description:
      'Enter <em>editor</em> to open the game editor.'
  },
  // {
  //   regex: /^editor$/,
  //   output: () =>
  //     'Please specify the file you wish to edit, e.g. <em>edit my-game</em>.'
  // },
  {
    regex: /^help$/i,
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
