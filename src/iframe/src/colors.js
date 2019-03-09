// TODO: consolidate - avoid duplication

// Lookup table for the css color strings
const rgbs = [
  'rgb(246,214,189)',
  'rgb(195,163,138)',
  'rgb(153,117,119)',
  'rgb(129,98,113)',
  'rgb(78,73,95)',
  'rgb(32,57,79)',
  'rgb(15,42,63)',
  'rgb(8,20,30)'
]

// Lookup table for triplet arrays containing R, G, and B values
const triplets = [
  [246, 214, 189],
  [195, 163, 138],
  [153, 117, 119],
  [129, 98, 113],
  [78, 73, 95],
  [32, 57, 79],
  [15, 42, 63],
  [8, 20, 30]
]

// Lookup tree for the combined integer representation of each color
let intLookup = []

// Loops over each of the color indexes, looks up associated color triplet, and
// calculates the equivalent integer representation by bit shifting each byte
// into the correct position.
for (let i = 0; i < 8; i++) {
  let values = triplets[i]

  // Shift each byte into the correct integer position.
  let possiblyNegativeInteger =
    (255 << 24) | // Alpha byte
    (values[2] << 16) | // B byte
    (values[1] << 8) | // G byte
    values[0] // R byte

  // Set the positive version of the above calculated integer into the lookup
  // table. A bitwise right shift of 0 places forces the number to be
  // interpreted as a positive integer
  intLookup[i] = possiblyNegativeInteger >>> 0
}

// The opposite of the intLookup. Each index is the color integer, and the value
// is the SCRIPT-8 integer color.
let reverseIntLookup = {}
for (let i = 0; i < 8; i++) {
  reverseIntLookup[intLookup[i]] = i
}

// const hexes = [
//   '#f6d6bd',
//   '#c3a38a',
//   '#997577',
//   '#816271',
//   '#4e495f',
//   '#20394f',
//   '#0f2a3f',
//   '#08141e'
// ]

const colors = {
  rgb(i) {
    return rgbs[i % rgbs.length]
  },

  triplet(i) {
    return triplets[i % triplets.length]
  },

  int(i) {
    return intLookup[i % intLookup.length]
  },

  // Looks up the integer value in the reverseIntLookup table. If it doesn't
  // exist, then the background color of 7 is returned instead.
  lookupInt(int) {
    if (int in reverseIntLookup) {
      return reverseIntLookup[int]
    }
    return 7
  }
}

export default colors
