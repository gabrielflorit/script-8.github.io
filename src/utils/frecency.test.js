import frecency from './frecency.js'

describe('frecency', () => {
  test('should work', () => {
    expect(frecency({ '2019-2-18': 2, '2018-2-18': 1 }, '2019-2-18')).toEqual(
      210
    )
  })
})
