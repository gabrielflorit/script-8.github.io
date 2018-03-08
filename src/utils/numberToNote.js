const notes = ['a', 'a#', 'b', 'c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#']

const numberToNote = number => notes[(number - 1) % notes.length]

export default numberToNote
