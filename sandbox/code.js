const s = 128

const cols = 16
const octaves = 3
const halfStepHeight = 3

const x = d3.scaleLinear()
  .domain([1, cols + 1])
  .range([0, 128])

const y = d3.scaleLinear()
  .domain([octaves * 12, 0])
  .range([0, octaves * 12 * halfStepHeight])

// eslint-disable-next-line no-unused-vars
function update () {}

const gap = x(2) - x(1)
const drawNote = ({ note, position, c = 6 }) => {
  lineV(x(position) + gap/2, y(note), y(0) - y(note) + 1, 6)
  rectFill(x(position) + gap/2 - Math.floor(gap/2) + 1, y(note), gap - 1, 1, 0)
}

clear()
// rectStroke(0, 0, s, s, 6)

let notes = range(cols - 2).map(d => random(1, octaves * 12))
notes = [1].concat(notes).concat(octaves * 12)
notes = [0, 1, 2, 3, 4, 5, 6, 7, 29, 30, 31, 32, 33, 34, 35, 36]
notes.forEach((note, position) => {
  drawNote({ note, position: position + 1 })
})

// eslint-disable-next-line no-unused-vars
function draw () {

  // notes.forEach((note, position) => {
  //   drawNote({ note, position })
  // })

}
