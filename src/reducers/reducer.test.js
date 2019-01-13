import reducer from './reducer.js'
import actions from '../actions/actions.js'
import initialState from '../store/initialState.js'
import screenTypes from '../utils/screenTypes.js'
import blank from '../utils/blank.js'

describe('tutorial', () => {
  test('setTutorialSlide', () => {
    const before = {
      ...initialState,
      tutorial: null
    }
    let newState = reducer(
      before,
      actions.setTutorialSlide({
        lessonIndex: 0,
        slideIndex: 0
      })
    )
    expect(newState).toEqual({
      ...before,
      tutorial: {
        lessonIndex: 0,
        slideIndex: 0
      }
    })
  })

  test('closeTutorial', () => {
    const before = {
      ...initialState,
      tutorial: { a: '1' }
    }
    let newState = reducer(before, actions.closeTutorial())
    expect(newState).toEqual({
      ...before,
      tutorial: null
    })
  })

  // // or they can advance to next slide
  // // SET_TUTORIAL_SLIDE()
  // // tutorial: 1
  // // newUser: false
  // test('setTutorialSlide', () => {
  //   const before = {
  //     ...initialState,
  //     tutorial: 2,
  //     newUser: true
  //   }
  //   let newState = reducer(before, actions.setTutorialSlide(10))
  //   expect(newState).toEqual({
  //     ...before,
  //     tutorial: 10,
  //     // screen: screenTypes.SONG,
  //     newUser: false
  //   })
  // })
})

describe('updateSprite', () => {
  test('complete', () => {
    const before = initialState
    const action = actions.updateSprite({
      sprite: [
        '01234567',
        '01234567',
        '01234567',
        '01234567',
        '01234567',
        '01234567',
        '01234567',
        '01234567'
      ],
      index: 1
    })
    expect(reducer(before, action)).toEqual({
      ...before,
      sprites: {
        1: [
          '01234567',
          '01234567',
          '01234567',
          '01234567',
          '01234567',
          '01234567',
          '01234567',
          '01234567'
        ]
      }
    })
  })

  test('partial', () => {
    const before = initialState
    const action = actions.updateSprite({
      sprite: [
        '        ',
        '01234567',
        '        ',
        '        ',
        '        ',
        '        ',
        '        ',
        '        '
      ],
      index: 1
    })
    expect(reducer(before, action)).toEqual({
      ...before,
      sprites: {
        1: [
          '        ',
          '01234567',
          '        ',
          '        ',
          '        ',
          '        ',
          '        ',
          '        '
        ]
      }
    })
  })

  test('empty', () => {
    const before = initialState
    const action = actions.updateSprite({
      sprite: [
        '        ',
        '        ',
        '        ',
        '        ',
        '        ',
        '        ',
        '        ',
        '        '
      ],
      index: 1
    })
    expect(reducer(before, action)).toEqual({
      ...before,
      sprites: {}
    })
  })
})

describe('updateChain', () => {
  test('complete', () => {
    const before = initialState
    const action = actions.updateChain({
      chain: {
        0: { 0: 0, 1: null },
        1: { 0: null, 1: null }
      },
      index: 1
    })
    expect(reducer(before, action)).toEqual({
      ...before,
      chains: {
        1: { 0: { 0: 0 } }
      }
    })
  })
})

describe('updatePhrase', () => {
  test('complete', () => {
    const before = initialState
    const action = actions.updatePhrase({
      phrase: {
        0: { note: 0 },
        1: {}
      },
      index: 1
    })
    expect(reducer(before, action)).toEqual({
      ...before,
      phrases: {
        1: { 0: { note: 0 } }
      }
    })
  })
})

describe('updateSfx', () => {
  test('complete', () => {
    const before = initialState
    const action = actions.updateSfx({
      sfx: {
        notes: ['c', 'c', 'c'],
        volumes: [1, 2, 3]
      },
      index: 1
    })
    expect(reducer(before, action)).toEqual({
      ...before,
      sfxs: [
        null,
        {
          notes: ['c', 'c', 'c'],
          volumes: [1, 2, 3]
        }
      ]
    })
  })
  test('partial', () => {
    const before = {
      ...initialState,
      sfxs: [
        null,
        {
          notes: ['c', 'c', 'b'],
          volumes: [1, 2, 3]
        }
      ]
    }
    const action = actions.updateSfx({
      sfx: {
        notes: ['c', 'c', 'c']
      },
      index: 1
    })
    expect(reducer(before, action)).toEqual({
      ...before,
      sfxs: [
        null,
        {
          notes: ['c', 'c', 'c'],
          volumes: [1, 2, 3]
        }
      ]
    })
  })
})

test('newGame from CODE', () => {
  const before = {
    ...initialState,
    gist: {
      something: 'here'
    },
    game: 'something here'
  }
  const action = actions.newGame(screenTypes.CODE)
  expect(reducer(before, action)).toEqual({
    ...before,
    gist: {},
    game: 'SCRIPT-8 NEW'
  })
})

test('newGame from SONG', () => {
  const before = {
    ...initialState,
    gist: {
      something: 'here'
    },
    game: 'something here'
  }
  const action = actions.newGame(screenTypes.SONG)
  expect(reducer(before, action)).toEqual({
    ...before,
    gist: {},
    game: blank
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
      'phrases.json': {
        content: JSON.stringify(
          {
            0: ['0b37']
          },
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
    phrases: {
      0: {
        0: {
          note: 11,
          octave: 3,
          volume: 7
        }
      }
    },
    gist: {
      isFetching: false,
      data
    }
  })
})

test('fetchGistSuccess bad data', () => {
  const before = {
    ...initialState,
    phrases: {},
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
    game: '',
    phrases: {},
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
