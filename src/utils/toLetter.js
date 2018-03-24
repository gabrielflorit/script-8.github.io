const notes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b']

const numberToNote = number => notes[number % notes.length]

const numberToOctave = number => Math.floor(number / notes.length)

const toLetter = (number, includeOctave, normalize) => {
  const letter = numberToNote(number)
  const octave = numberToOctave(number) + (normalize ? 2 : 0)
  return !includeOctave ? letter : `${letter}${octave}`
}

export { numberToOctave }

export default toLetter
