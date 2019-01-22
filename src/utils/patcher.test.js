import patcher from './patcher.js'

const slides = [
  {},
  {},
  {
    game:
      "draw = () => {\n  clear()\n  print(0, 0, 'Hello world!', 0)\n  print(8, 8, 'Hello world!', 1)\n  print(16, 16, 'Hello world!', 2)\n  print(24, 24, 'Hello world!', 3)\n}"
  },
  {},
  {
    game: 'DEL3'
  },
  {},
  {
    game: 'SAME'
  },
  {
    game: 'DEL2-3'
  },
  {
    game:
      "ADD2\n  print(8, 8, 'Hello world!', 1)\n  print(16, 16, 'Hello world!', 2)"
  },
  {
    game:
      "REP2-4\n  print(8, 8, 'Hola mundo!', 1)\n  print(16, 16, 'Hola mundo!', 2)"
  },
  {
    game: 'REP1\n  cleared()'
  },
  {
    game: 'reset'
  }
]

describe('patcher', () => {
  test('should return source slide', () => {
    expect(patcher({ slides, index: 2 })).toEqual(
      "draw = () => {\n  clear()\n  print(0, 0, 'Hello world!', 0)\n  print(8, 8, 'Hello world!', 1)\n  print(16, 16, 'Hello world!', 2)\n  print(24, 24, 'Hello world!', 3)\n}"
    )
  })
  test('should return first patch', () => {
    expect(patcher({ slides, index: 4 })).toEqual(
      "draw = () => {\n  clear()\n  print(0, 0, 'Hello world!', 0)\n  print(16, 16, 'Hello world!', 2)\n  print(24, 24, 'Hello world!', 3)\n}"
    )
  })
  test('should return same if requested', () => {
    expect(patcher({ slides, index: 6 })).toEqual(
      "draw = () => {\n  clear()\n  print(0, 0, 'Hello world!', 0)\n  print(16, 16, 'Hello world!', 2)\n  print(24, 24, 'Hello world!', 3)\n}"
    )
  })
  test('should delete a range', () => {
    expect(patcher({ slides, index: 7 })).toEqual(
      "draw = () => {\n  clear()\n  print(24, 24, 'Hello world!', 3)\n}"
    )
  })
  test('should delete a range', () => {
    expect(patcher({ slides, index: 8 })).toEqual(
      "draw = () => {\n  clear()\n  print(8, 8, 'Hello world!', 1)\n  print(16, 16, 'Hello world!', 2)\n  print(24, 24, 'Hello world!', 3)\n}"
    )
  })
  test('should replace a range', () => {
    expect(patcher({ slides, index: 9 })).toEqual(
      "draw = () => {\n  clear()\n  print(8, 8, 'Hola mundo!', 1)\n  print(16, 16, 'Hola mundo!', 2)\n}"
    )
  })
  test('should replace a line', () => {
    expect(patcher({ slides, index: 10 })).toEqual(
      "draw = () => {\n  cleared()\n  print(8, 8, 'Hola mundo!', 1)\n  print(16, 16, 'Hola mundo!', 2)\n}"
    )
  })
  test('should accept a reset', () => {
    expect(patcher({ slides, index: 11 })).toEqual('reset')
  })
})
