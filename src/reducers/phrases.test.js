import { compressPhrases, expandPhrases } from './phrases.js'

test('compressPhrases', () => {
  const expanded = {
    '0': {
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
    },
    '1': {
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

  const compressed = {
    0: ['0b37', '2a37', '5a#37'],
    1: ['3b37', '4a#37', '5g#37']
  }

  expect(compressPhrases(expanded)).toEqual(compressed)
})

test('expandPhrases', () => {
  const expanded = {
    '0': {
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
    },
    '1': {
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

  const compressed = {
    0: ['0b37', '2a37', '5a#37', '12a37'],
    1: ['3b37', '4a#37', '5g#37']
  }

  expect(expandPhrases(compressed)).toEqual(expanded)
})
