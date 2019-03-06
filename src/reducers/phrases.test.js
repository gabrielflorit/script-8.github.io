import {
  compressPhrases,
  expandPhrases
} from '../iframe/src/gistParsers/phrases.js'

test('compressPhrases', () => {
  const expanded = {
    '0': {
      notes: {
        '5': {
          note: 10,
          octave: 3,
          volume: 7
        },
        '0': {
          note: 11,
          octave: 3,
          volume: 7
        },
        '2': {
          note: 9,
          octave: 3,
          volume: 7
        }
      }
    },
    '1': {
      notes: {
        '3': {
          note: 11,
          octave: 3,
          volume: 7
        },
        '4': {
          note: 10,
          octave: 3,
          volume: 7
        },
        '5': {
          note: 8,
          octave: 3,
          volume: 7
        }
      }
    }
  }

  const compressed = {
    0: { notes: ['0b37', '2a37', '5a#37'], tempo: 0 },
    1: { notes: ['3b37', '4a#37', '5g#37'], tempo: 0 }
  }

  expect(compressPhrases(expanded)).toEqual(compressed)
})

test('expandPhrases', () => {
  const expanded = {
    '0': {
      tempo: 0,
      notes: {
        '5': {
          note: 10,
          octave: 3,
          volume: 7
        },
        '0': {
          note: 11,
          octave: 3,
          volume: 7
        },
        '2': {
          note: 9,
          octave: 3,
          volume: 7
        },
        '12': {
          note: 9,
          octave: 3,
          volume: 7
        }
      }
    },
    '1': {
      tempo: 1,
      notes: {
        '3': {
          note: 11,
          octave: 3,
          volume: 7
        },
        '4': {
          note: 10,
          octave: 3,
          volume: 7
        },
        '5': {
          note: 8,
          octave: 3,
          volume: 7
        }
      }
    }
  }

  const compressed = {
    0: { notes: ['0b37', '2a37', '5a#37', '12a37'] },
    1: { notes: ['3b37', '4a#37', '5g#37'], tempo: 1 }
  }

  expect(expandPhrases(compressed)).toEqual(expanded)
})
