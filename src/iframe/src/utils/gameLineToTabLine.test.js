import gameLineToTabLine from './gameLineToTabLine.js'

describe('gameLineToTabLine', () => {
  test('full game', () => {
    const game = {
      0: { text: 'one\ntwo\nthree', active: true, key: 0 },
      1: { text: '', key: 1, active: false },
      2: { text: 'four', key: 2, active: false },
      3: { text: 'five\nsix', key: 3, active: false }
    }

    expect(gameLineToTabLine({ game, gameLine: 0 })).toEqual({
      tab: 0,
      tabLine: 0
    })
    expect(gameLineToTabLine({ game, gameLine: 3 })).toEqual({
      tab: 2,
      tabLine: 0
    })
    expect(gameLineToTabLine({ game, gameLine: 4 })).toEqual({
      tab: 3,
      tabLine: 0
    })
    expect(gameLineToTabLine({ game, gameLine: 5 })).toEqual({
      tab: 3,
      tabLine: 1
    })
    expect(gameLineToTabLine({ game, gameLine: 6 })).toEqual(null)
  })

  test('full game', () => {
    const game = {
      0: { text: '', active: true, key: 0 },
      1: { text: '', key: 1, active: false },
      2: { text: '', key: 2, active: false },
      3: { text: '', key: 3, active: false }
    }

    expect(gameLineToTabLine({ game, gameLine: 0 })).toEqual(null)
    expect(gameLineToTabLine({ game, gameLine: 3 })).toEqual(null)
  })
})
