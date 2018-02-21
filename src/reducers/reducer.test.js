import reducer from './reducer.js'
import actions from '../actions/actions.js'
import initialState from '../store/initialState.js'

// test screen types
test('setScreen', () => {
  const before = initialState
  const action = actions.setScreen('RUN')
  expect(reducer(before, action)).toEqual({
    ...before,
    screen: 'RUN'
  })
})

test('fetchGistRequest', () => {
  const before = {
    ...initialState,
    gist: {}
  }
  const action = actions.fetchGistRequest()
  expect(reducer(before, action)).toEqual({
    ...before,
    gist: {
      isFetching: true
    }
  })
})

test('fetchGistSuccess', () => {
  const before = {
    ...initialState,
    gist: {
      isFetching: true
    }
  }
  const data = {
    something: 'else'
  }
  const action = actions.fetchGistSuccess(data)
  expect(reducer(before, action)).toEqual({
    ...before,
    gist: {
      isFetching: false,
      data: {
        something: 'else'
      }
    }
  })
})







































// describe('actions.inputTerminalCommand', () => {
//   test('setNextAction', () => {
//     const before = initialState
//     const action = actions.setNextAction('save')
//     expect(reducer(before, action)).toEqual({
//       ...before,
//       nextAction: 'save'
//     })
//   })
//   test('clearNextAction', () => {
//     const before = {
//       ...initialState,
//       nextAction: 'save'
//     }
//     const action = actions.clearNextAction()
//     expect(reducer(before, action)).toEqual({
//       ...before,
//       nextAction: null
//     })
//   })
//   test('createGistRequest', () => {
//     const before = {
//       ...initialState,
//       gist: {
//         data: 'my-data'
//       }
//     }
//     const action = actions.createGistRequest()
//     expect(reducer(before, action)).toEqual({
//       ...before,
//       gist: {
//         isFetching: true
//       }
//     })
//   })
//   test('createGistSuccess', () => {
//     const before = {
//       ...initialState,
//       gist: {
//         isFetching: true,
//         data: 'my-data'
//       }
//     }
//     const data = {
//       something: 'else'
//     }
//     const action = actions.createGistSuccess(data)
//     expect(reducer(before, action)).toEqual({
//       ...before,
//       gist: {
//         isFetching: false,
//         data: {
//           something: 'else'
//         }
//       }
//     })
//   })
//   test('tokenRequest', () => {
//     const before = initialState
//     const action = actions.tokenRequest()
//     expect(reducer(before, action)).toEqual({
//       ...before,
//       token: {
//         ...before.token,
//         isFetching: true
//       }
//     })
//   })
//   test('tokenSuccess', () => {
//     const before = {
//       ...initialState,
//       token: {
//         value: 'old',
//         isFetching: true
//       }
//     }
//     const action = actions.tokenSuccess({ token: 'a token' })
//     expect(reducer(before, action)).toEqual({
//       ...before,
//       token: {
//         value: 'a token'
//       }
//     })
//   })
//   test('clear', () => {
//     const before = initialState
//     const action = actions.inputTerminalCommand('clEAR')
//     expect(reducer(before, action)).toEqual({
//       ...before,
//       terminalHistory: []
//     })
//   })
//   test('help', () => {
//     const command = 'help'
//     const before = initialState
//     const action = actions.inputTerminalCommand(command)
//     expect(reducer(before, action)).toEqual({
//       ...before,
//       terminalHistory: [
//         ...before.terminalHistory,
//         {
//           input: command,
//           output: [
//             '<div>Enter <em>clear</em> to clear the screen.</div>',
//             '<div>Enter <em>editor</em> to open the game editor.</div>',
//             '<div>Enter <em>help</em> for help.</div>'
//           ].join('')
//         }
//       ]
//     })
//   })
//   test('editor', () => {
//     const command = 'editOr'
//     const before = initialState
//     const action = actions.inputTerminalCommand(command)
//     expect(reducer(before, action)).toEqual({
//       ...before,
//       terminalHistory: [
//         ...before.terminalHistory,
//         {
//           input: command,
//           output: ''
//         }
//       ]
//     })
//   })
//   test('yo', () => {
//     const command = 'yo'
//     const before = initialState
//     const action = actions.inputTerminalCommand(command)
//     expect(reducer(before, action)).toEqual({
//       ...before,
//       terminalHistory: [
//         ...before.terminalHistory,
//         {
//           input: command,
//           output:
//             "<span class='error'>I did not understand that command.</span>"
//         }
//       ]
//     })
//   })
// })

// test('actions.clearTerminal', () => {
//   const before = {
//     ...initialState,
//     terminalHistory: ['a']
//   }
//   const action = actions.clearTerminal()
//   expect(reducer(before, action)).toEqual({
//     ...before,
//     terminalHistory: []
//   })
// })

// test('actions.updateGame', () => {
//   const before = {
//     ...initialState
//   }
//   const action = actions.updateGame('one two three')
//   expect(reducer(before, action)).toEqual({
//     ...before,
//     game: 'one two three'
//   })
// })
