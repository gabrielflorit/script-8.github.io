const notes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b']

const numberToNote = number => notes[(number) % notes.length]

const numberToOctave = number => Math.floor((number) / notes.length) + 3

export { numberToNote, numberToOctave }
