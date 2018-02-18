import reducer from './reducer.js'
import actions from '../actions/actions.js'
import initialState from '../store/initialState.js'

describe('actions.inputTerminalCommand', () => {
  test('clear', () => {
    const before = initialState
    const action = actions.inputTerminalCommand('clear')
    expect(reducer(before, action)).toEqual({
      ...before,
      terminalHistory: []
    })
  })
  test('help', () => {
    const command = 'help'
    const before = initialState
    const action = actions.inputTerminalCommand(command)
    expect(reducer(before, action)).toEqual({
      ...before,
      terminalHistory: [
        ...before.terminalHistory,
        {
          input: command,
          output: [
            '<div>Enter <em>clear</em> to clear the screen.</div>',
            '<div>Enter <em>edit</em> to open the game editor.</div>',
            '<div>Enter <em>help</em> for help.</div>'
          ].join('')
        }
      ]
    })
  })
  test('edit', () => {
    const command = 'edit'
    const before = initialState
    const action = actions.inputTerminalCommand(command)
    expect(reducer(before, action)).toEqual({
      ...before,
      terminalHistory: [
        ...before.terminalHistory,
        {
          input: command,
          output:
            // 'Please specify the file you wish to edit, e.g. <em>edit my-game</em>.'
            ''
        }
      ]
    })
  })
  // test('edit my-game', () => {
  //   const command = 'edit my-game'
  //   const before = initialState
  //   const action = actions.inputTerminalCommand(command)
  //   expect(reducer(before, action)).toEqual({
  //     ...before,
  //     game: {
  //       name: 'my-game'
  //     },
  //     terminalHistory: [
  //       ...before.terminalHistory,
  //       {
  //         input: command,
  //         output: ''
  //       }
  //     ]
  //   })
  // })
  test('yo', () => {
    const command = 'yo'
    const before = initialState
    const action = actions.inputTerminalCommand(command)
    expect(reducer(before, action)).toEqual({
      ...before,
      terminalHistory: [
        ...before.terminalHistory,
        {
          input: command,
          output:
            "<span class='error'>I did not understand that command.</span>"
        }
      ]
    })
  })
})

test('actions.clearTerminal', () => {
  const before = {
    ...initialState,
    terminalHistory: ['a']
  }
  const action = actions.clearTerminal()
  expect(reducer(before, action)).toEqual({
    ...before,
    terminalHistory: []
  })
})
