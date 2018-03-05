const s = 128

const cols = 16
const octaves = 3
const halfStepHeight = 2
const totalNotes = octaves * 12 + 1
const noteWidth = 5
const volumeHeight = 2
const notesVolumeGap = 8

const x = d3.scaleLinear()
  .domain([1, cols + 1])
  .range([0, s])

const gap = x(2) - x(1)

const noteY = d3.scaleLinear()
  .domain([totalNotes, 0])
  .range([halfStepHeight - 1, (totalNotes + 1) * halfStepHeight - 1])

const volumeY = d3.scaleLinear()
  .domain([4, 1])
  .range([noteY.range()[1] + notesVolumeGap, noteY.range()[1] + notesVolumeGap + 4*volumeHeight])

const volumeColor = d3.scale

// eslint-disable-next-line no-unused-vars
function update () {}

const drawNote = ({ note, position, c = 6 }) => {
  lineV(x(position) + gap/2, noteY(note), noteY(0) - noteY(note) + 1, 6, true)
  rectFill(x(position) + gap/2 - noteWidth/2 + 1, noteY(note) - halfStepHeight + 1, noteWidth, halfStepHeight, 0)
}

const drawVolume = ({ volume, position }) => {
  rectFill(x(position) + gap/2 - noteWidth/2 + 1, volumeY(volume), noteWidth, volumeHeight, (4 - volume)*2)
}

clear()
// rectStroke(0, 0, s, s, 6)

let notes = [0, 1, 3, 5, 6, 8, 10, 12, 30, 31, 32, 33, 34, 35, 36, 37]
// let notes = [0, 1, 3, 5, 6, 8, 10, 12, 13, 43, 44, 45, 46, 47, 48, 49]
// notes = range(32)
notes.forEach((note, position) => {
  drawNote({ note, position: position + 1 })
  drawVolume({ volume: ((position + 3) % 4) + 1, position: position + 1 })
})

// eslint-disable-next-line no-unused-vars
function draw () {
}
