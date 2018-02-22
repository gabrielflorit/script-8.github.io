const boot = `
const colors = [
  3,
  5,5,5,5,5,5,
  6,6,6,6,6,6,6,
  7,7,7,7,7,7,7,7,
  5,5,5,5,5,5,
  6,6,6,6,6,6,6,
  7,7,7,7,7,7,7,7,
  5,5,5,5,5,5,
  6,6,6,6,6,6,6,
  7,7,7,7,7,7,7,7,
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
  if (y <= 32) {
    y++
  }
}

const xs = [...new Array(128)]

function draw() {
  xs.forEach((_, x) => {
    rectFill(x, y + 32 * 0, 1, 1, x)
    rectFill(x, y + 32 * 1, 1, 1, x)
    rectFill(x, y + 32 * 2, 1, 1, x)
    rectFill(x, y + 32 * 3, 1, 1, x)
  })
  // rectFill(random(0, 128), y, 1, 1, 7)
}

// function update() {
//   y = j
//   if (y <= 64) {
//     j++
//   }
// }

// const xs = [...new Array(64)]

// function draw() {
//   xs.forEach((_, x) => {
//     rectFill(x*2, y*2, 2, 2, x)
//   })
//   rectFill(random(0, 64) * 2, y*2, 2, 2, 7)
// }
`

export default boot
