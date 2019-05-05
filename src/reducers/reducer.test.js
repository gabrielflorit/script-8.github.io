import reducer from './reducer.js'
import actions from '../actions/actions.js'
import initialState from '../iframe/src/store/initialState.js'
import screenTypes from '../iframe/src/utils/screenTypes.js'
import blank from '../iframe/src/blank.js'
import { assembleMiscLines } from './game.js'
import { parseGistGame } from '../iframe/src/gistParsers/game.js'

describe('dismissedNotices', () => {
  test('blank to one', () => {
    const before = {
      ...initialState
    }
    const newState = reducer(before, actions.dismissNotices([1, 2, 3]))
    expect(newState).toEqual({
      ...before,
      dismissedNotices: [1, 2, 3]
    })
  })
  test('one to two', () => {
    const before = {
      ...initialState,
      dismissedNotices: [1]
    }
    const newState = reducer(before, actions.dismissNotices([2, 1, 3]))
    expect(newState).toEqual({
      ...before,
      dismissedNotices: [2, 1, 3]
    })
  })
})

describe('assembleMiscLines', () => {
  test('tab 0', () => {
    expect(
      assembleMiscLines({
        0: {
          text: 'one\ntwo'
        }
      })
    ).toEqual([2, 0, 0, 0, 0, 0, 0, 0])
  })

  test('tab 0 and 1', () => {
    expect(
      assembleMiscLines({
        0: {
          text: 'one\ntwo'
        },
        1: {
          text: 'one\ntwo'
        }
      })
    ).toEqual([2, 2, 0, 0, 0, 0, 0, 0])
  })

  test('tab 0, 4, and 6', () => {
    expect(
      assembleMiscLines({
        0: {
          text: 'one\ntwo'
        },
        4: {
          text: ''
        },
        6: {
          text: 'one'
        }
      })
    ).toEqual([2, 0, 0, 0, 0, 0, 1, 0])
  })
})

describe('parseGistGame', () => {
  test('no lines', () => {
    expect(
      parseGistGame({
        files: {
          'code.js': {
            content: ''
          }
        }
      })
    ).toEqual({ 0: { text: '', key: 0, active: true } })
  })
  test('one line', () => {
    expect(
      parseGistGame({
        files: {
          'code.js': {
            content: 'one'
          }
        }
      })
    ).toEqual({ 0: { text: 'one', key: 0, active: true } })
  })
  test('two tabs', () => {
    expect(
      parseGistGame({
        files: {
          'code.js': {
            content: 'one\ntwo\nthree\nfour\nfive\nsix'
          },
          'misc.json': {
            content: '{"lines": [3,0,1,2]}'
          }
        }
      })
    ).toEqual({
      0: { text: 'one\ntwo\nthree', active: true, key: 0 },
      1: { text: '', key: 1, active: false },
      2: { text: 'four', key: 2, active: false },
      3: { text: 'five\nsix', key: 3, active: false }
    })
  })
})

describe('docHistories', () => {
  test('newGame', () => {
    const before = {
      ...initialState,
      docHistories: {
        0: 'something'
      }
    }
    const newState = reducer(before, actions.newGame())
    expect(newState).toEqual({
      ...before,
      docHistories: {}
    })
  })
  test('updateHistory', () => {
    const before = {
      ...initialState,
      docHistories: {
        0: 'something'
      }
    }
    const newState = reducer(
      before,
      actions.updateHistory({
        index: 2,
        history: {
          name: 'gabriel'
        }
      })
    )
    expect(newState).toEqual({
      ...before,
      docHistories: {
        0: 'something',
        2: {
          name: 'gabriel'
        }
      }
    })
  })
})

describe('tutorial', () => {
  test('setTutorialSlide', () => {
    const before = {
      ...initialState,
      tutorial: null
    }
    const newState = reducer(
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
    const newState = reducer(before, actions.closeTutorial())
    expect(newState).toEqual({
      ...before,
      tutorial: null
    })
  })
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
        notes: {
          0: { note: 0 },
          1: {}
        }
      },
      index: 1
    })
    expect(reducer(before, action)).toEqual({
      ...before,
      phrases: {
        1: { notes: { 0: { note: 0 } } }
      }
    })
  })
  test('omit empty', () => {
    const before = {
      ...initialState,
      phrases: {
        1: { notes: { 0: { note: 0 } } }
      }
    }
    const action = actions.updatePhrase({
      phrase: {
        notes: {},
        tempo: 0
      },
      index: 1
    })
    expect(reducer(before, action)).toEqual({
      ...before,
      phrases: {}
    })
  })
  test('omit empty complex', () => {
    const before = {
      ...initialState,
      phrases: {
        '6': {
          tempo: 0,
          notes: {
            '0': {
              note: 11,
              octave: 0,
              volume: 7
            }
          }
        }
      }
    }
    const action = actions.updatePhrase({
      phrase: {
        tempo: 0,
        notes: {
          '0': null
        }
      },
      index: '6'
    })
    expect(reducer(before, action)).toEqual({
      ...before,
      phrases: {}
    })
  })
})

test('newGame from CODE', () => {
  const before = {
    ...initialState,
    gist: {
      something: 'here'
    },
    game: { 0: 'first tab', 1: 'second tab' }
  }
  const action = actions.newGame(screenTypes.CODE)
  expect(reducer(before, action)).toEqual({
    ...before,
    gist: {},
    game: { 0: { text: 'SCRIPT-8 NEW', active: true, key: 0 } }
  })
})

test('newGame from SONG', () => {
  const before = {
    ...initialState,
    gist: {
      something: 'here'
    },
    game: { 0: { text: 'first tab' }, 1: { text: 'second tab' } }
  }
  const action = actions.newGame(screenTypes.SONG)
  expect(reducer(before, action)).toEqual({
    ...before,
    gist: {},
    game: { 0: { text: blank, active: true, key: 0 } }
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
      'misc.json': {
        content: JSON.stringify({ iframeVersion: '0.1.250' })
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
  const after = reducer(before, action)
  expect(after).toEqual({
    ...before,
    iframeVersion: '0.1.250',
    game: { 0: { text: 'my game', active: true, key: 0 } },
    phrases: {
      0: {
        tempo: 0,
        notes: {
          0: {
            note: 11,
            octave: 3,
            volume: 7
          }
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
    iframeVersion: '0.1.247',
    game: { 0: { text: '', active: true, key: 0 } },
    phrases: {},
    gist: {
      isFetching: false,
      data
    }
  })
})

test('setCodeTab', () => {
  const before = {
    ...initialState
  }

  const action = actions.setCodeTab(1)
  expect(reducer(before, action)).toEqual({
    ...before,
    game: {
      0: { text: '', active: false, key: 0 },
      1: { active: true, key: 1 }
    }
  })
})

test('updateGame', () => {
  const before = {
    ...initialState
  }
  const action = actions.updateGame({ tab: 1, content: 'one two three' })
  expect(reducer(before, action)).toEqual({
    ...before,
    game: {
      0: { text: '', active: true, key: 0 },
      1: { text: 'one two three' }
    }
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
      data: 'my-data',
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
