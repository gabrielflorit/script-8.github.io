import reducer from './reducer.js'
import actions from '../actions/actions.js'
import initialState from '../store/initialState.js'

test('updateSfx', () => {
  const before = {
    ...initialState,
    sfxs: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  }
  const action = actions.updateSfx({ sfx: 'new', index: 1 })
  expect(reducer(before, action)).toEqual({
    ...before,
    sfxs: ['a', 'new', 'c', 'd', 'e', 'f', 'g', 'h']
  })
})

test('newGame', () => {
  const before = {
    ...initialState,
    gist: {
      something: 'here'
    },
    game: 'something here'
  }
  const action = actions.newGame()
  expect(reducer(before, action)).toEqual({
    ...before,
    gist: {},
    game: 'SCRIPT-8 NEW'
  })
})

test('setNextAction', () => {
  const before = initialState
  const action = actions.setNextAction('save')
  expect(reducer(before, action)).toEqual({
    ...before,
    nextAction: 'save'
  })
})

test('clearNextAction', () => {
  const before = {
    ...initialState,
    nextAction: 'save'
  }
  const action = actions.clearNextAction()
  expect(reducer(before, action)).toEqual({
    ...before,
    nextAction: null
  })
})

test('tokenRequest', () => {
  const before = initialState
  const action = actions.tokenRequest()
  expect(reducer(before, action)).toEqual({
    ...before,
    token: {
      ...before.token,
      isFetching: true
    }
  })
})

test('tokenSuccess', () => {
  const before = {
    ...initialState,
    token: {
      value: 'old',
      isFetching: true
    }
  }
  const action = actions.tokenSuccess({ token: 'a token', user: 'gabriel' })
  expect(reducer(before, action)).toEqual({
    ...before,
    token: {
      value: 'a token',
      user: 'gabriel'
    }
  })
})

test('finishBoot', () => {
  const before = initialState
  const action = actions.finishBoot()
  expect(reducer(before, action)).toEqual({
    ...before,
    booted: true
  })
})

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

test('fetchGistSuccess good data', () => {
  const before = {
    ...initialState,
    gist: {
      isFetching: true
    }
  }
  const data = {
    something: 'else',
    files: {
      'code.js': {
        content: 'my game'
      },
      'sfxs.json': {
        content: JSON.stringify(
          ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
          null,
          2
        )
      }
    }
  }
  const action = actions.fetchGistSuccess(data)
  expect(reducer(before, action)).toEqual({
    ...before,
    game: 'my game',
    sfxs: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    gist: {
      isFetching: false,
      data
    }
  })
})

test('fetchGistSuccess bad data', () => {
  const before = {
    ...initialState,
    sfxs: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    gist: {
      isFetching: true
    }
  }
  const data = {
    something: 'else',
    files: {}
  }
  const action = actions.fetchGistSuccess(data)
  expect(reducer(before, action)).toEqual({
    ...before,
    game: null,
    sfxs: [...Array(8)].map(d => null),
    gist: {
      isFetching: false,
      data
    }
  })
})

test('updateGame', () => {
  const before = {
    ...initialState
  }
  const action = actions.updateGame('one two three')
  expect(reducer(before, action)).toEqual({
    ...before,
    game: 'one two three'
  })
})

test('saveGistRequest', () => {
  const before = {
    ...initialState,
    gist: {
      data: 'my-data'
    }
  }
  const action = actions.saveGistRequest()
  expect(reducer(before, action)).toEqual({
    ...before,
    gist: {
      isFetching: true
    }
  })
})

test('saveGistSuccess', () => {
  const before = {
    ...initialState,
    gist: {
      isFetching: true,
      data: 'my-data'
    }
  }
  const data = {
    something: 'else'
  }
  const action = actions.saveGistSuccess(data)
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
