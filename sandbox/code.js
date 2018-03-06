const s = 128

const cols = 16
const octaves = 3
const halfStepHeight = 2
const totalNotes = octaves * 12 + 1
const noteWidth = 7
const volumeHeight = 2
const notesVolumeMargin = 12
const notesPadding = { top: 6, bottom: 6 }
const volumePadding = { top: 6, bottom: 6 }

// let notes = [0, 1, 2, 3, 4, 5, 6, 7, 30, 31, 32, 33, 34, 35, 36, 37]
let notes = range(cols).map(d => ({
  note: d,
  volume: d % 4 + 1
}))
notes[0].note = 0
notes[1].note = 1
notes[14].note = 36
notes[15].note = 37

const x = d3
  .scaleLinear()
  .domain([1, cols + 1])
  .range([0, s])

const gap = x(2) - x(1)

const noteY = d3
  .scaleLinear()
  .domain([totalNotes, 0])
  .range([notesPadding.top, totalNotes * halfStepHeight + notesPadding.top])

const volumeY = d3
  .scaleLinear()
  .domain([4, 1])
  .range([
    noteY.range()[1] +
      notesPadding.bottom +
      notesVolumeMargin +
      volumePadding.top,
    noteY.range()[1] +
      notesPadding.bottom +
      notesVolumeMargin +
      volumePadding.top +
      4 * volumeHeight
  ])

const drawNote = ({ note, position, c = 6 }) => {
  lineV(x(position) + gap / 2, noteY(note), noteY(0) - noteY(note) + 1, 6)
  rectFill(
    x(position) + gap / 2 - noteWidth / 2 + 1,
    noteY(note) - halfStepHeight + 1,
    noteWidth,
    halfStepHeight,
    note > 0 ? 0 : 6
  )
}

const drawVolume = ({ volume, position }) => {
  rectFill(
    x(position) + gap / 2 - noteWidth / 2 + 1,
    volumeY(volume),
    noteWidth,
    volumeHeight,
    4 - volume
  )
}

// eslint-disable-next-line no-unused-vars
function onMouseMove (offset) {
  const position = x.invert(offset[0])
  const positionModulus = position % 1
  if (
    offset[1] >= noteY.range()[0] - notesPadding.top &&
    offset[1] <= noteY.range()[1] + notesPadding.bottom &&
    positionModulus > 0.15 &&
    positionModulus < 0.85
  ) {
    const note = clamp(Math.ceil(noteY.invert(offset[1])), 0, 37)
    notes[Math.floor(position) - 1].note = note
  }

  if (
    offset[1] >= volumeY.range()[0] - volumePadding.top &&
    offset[1] <= volumeY.range()[1] + volumePadding.bottom &&
    positionModulus > 0.15 &&
    positionModulus < 0.85
  ) {
    const volume = clamp(Math.ceil(volumeY.invert(offset[1])), 1, 4)
    notes[Math.floor(position) - 1].volume = volume
  }
}

// eslint-disable-next-line no-unused-vars
function update () {}

// eslint-disable-next-line no-unused-vars
function draw () {
  clear()
  lineH(0, noteY.range()[0] - notesPadding.top, 128, 6, true)
  lineH(0, noteY.range()[1] + notesPadding.bottom, 128, 6, true)
  lineH(0, volumeY.range()[0] - volumePadding.top, 128, 6, true)
  lineH(0, volumeY.range()[1] + volumePadding.bottom, 128, 6, true)
  notes.forEach(({ note, volume }, position) => {
    drawNote({ note, position: position + 1 })
    drawVolume({ volume, position: position + 1 })
  })
}
