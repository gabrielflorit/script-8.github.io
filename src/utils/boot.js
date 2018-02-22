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
let i = 0
let j = 0

function update() {
  i = Math.floor(j / 2) * 2
  if (i <= 30) {
    j++
  }
}

const times = [...new Array(16)]

function draw() {
  // times.forEach(_ => {
  //   const x = random(0, 31) * d * d
  //   const y = random(0, 31) * d * d
  //   const c = colors[random(0, colors.length - 1)]
  //   rectFill(x, y, d, d, c)
  // })
  // times.forEach(_ => {
  //   const x = random(0, 128)
  //   const y = random(0, 128)
  //   rectFill(x, y, 1, 1, x)
  // })
  times.forEach(_ => {
    const x = random(0, i) * d * d
    const y = random(0, i) * d * d
    const c = colors[random(0, colors.length - 1)]
    rectFill((64 + i * d) - x, (64 + i * d) - y, d, d, c)
  })
}
`

export default boot
