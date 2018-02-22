const boot = `
const colors = [
  3,
  7
]

function random(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const d = 2
rectFill(0, 0, 128, 128, 7)

let y = 0
function update() {
  if (y < 128) y++
}

let count = [...new Array(8)]

let rects = count.map(_ => [0, 0])

function draw() {
  // every tick,

  // draw the previous rects blue
  rects.forEach(rect => {
    rectFill(rect[0], rect[1], 1, 1, 6)
  })

  // set coords of new rects,
  rects = rects.map(_ => [random(0, 64) * 2, y])

  // and draw the new ones white
  rects.forEach(rect => {
    rectFill(rect[0], rect[1], 1, 1, 3)
  })
}
`

export default boot

























// const rects = [...new Array(128 * 16)]
//   .map(_ => ({
//     x: random(0, 64) * 2,
//     y: random(0, 64) * 2
//   }))

// rects.forEach(r => {
//   rectFill(r.x, r.y, 1, 1, 6)
// })

// let rect = [0, 0]

// function draw() {
//   // if (i % 32 === 0) {
//     rectFill(rect[0], rect[1], 1, 1, 7)
//     rect = [random(0, 64) * 2, i]
//     rectFill(rect[0], rect[1], 1, 1, 0)
//   // }
