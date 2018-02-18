import reducer from './reducer.js'
import actions from './../actions/actions.js'
import initialState from './initialState.js'
import commands from './../utils/commands.js'

// describe('actions.inputTerminalCommand', () => {
//   test('help', () => {
//     const before = initialState
//     const action = actions.inputTerminalCommand('help')
//     expect(reducer(before, action)).toEqual({
//       ...before,
//       terminalHistory: [
//         ...before.terminalHistory,
//         {
//           input: 'help',
//           output: commands.map(d => `<div>${d.description}</div>`)
//         }
//       ]
//     })
//   })
// })

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
