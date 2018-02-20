import reducer from './reducer.js'
import actions from '../actions/actions.js'
import initialState from '../store/initialState.js'

describe('actions.inputTerminalCommand', () => {
  test('setToken', () => {
    const before = initialState
    const action = actions.setToken('my-token')
    expect(reducer(before, action)).toEqual({
      ...before,
      token: 'my-token'
    })
  })
  test('clear', () => {
    const before = initialState
    const action = actions.inputTerminalCommand('clEAR')
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
            '<div>Enter <em>editor</em> to open the game editor.</div>',
            '<div>Enter <em>help</em> for help.</div>'
          ].join('')
        }
      ]
    })
  })
  test('editor', () => {
    const command = 'editOr'
    const before = initialState
    const action = actions.inputTerminalCommand(command)
    expect(reducer(before, action)).toEqual({
      ...before,
      terminalHistory: [
        ...before.terminalHistory,
        {
          input: command,
          output: ''
        }
      ]
    })
  })
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

test('actions.updateGame', () => {
  const before = {
    ...initialState
  }
  const action = actions.updateGame('one two three')
  expect(reducer(before, action)).toEqual({
    ...before,
    game: 'one two three'
  })
})
