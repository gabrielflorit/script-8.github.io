import reducer from './reducer.js'
import actions from './../actions/actions.js'
import initialState from './../store/initialState.js'
import makeOutput from './../utils/makeOutput.js'

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
          output: makeOutput(command)
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
          output: makeOutput(command)
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
