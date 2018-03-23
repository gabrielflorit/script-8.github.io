const notes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b']

const numberToNote = number => notes[number % notes.length]

const numberToOctave = number => Math.floor(number / notes.length)

const toLetter = (number, includeOctave) => {
  const letter = numberToNote(number)
  const octave = numberToOctave(number)
  return !includeOctave ? letter : `${letter}${octave}`
}

export { numberToOctave }

export default toLetter
