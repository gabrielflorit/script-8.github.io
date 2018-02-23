const boot = `

function random(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

rectFill(0, 0, 128, 128, 7)

const screens = [
  'glitch',
  'stable',
  'bios',
  'next'
]

let screenIndex = 0
let i = 0

function update() {
  const screen = screens[screenIndex]
  if (screen === 'glitch') {
    i++
    if (i > 20) {
      i = 0
      screenIndex++
    }
  }
  if (screen === 'stable') {
    i++
    if (i > 20) {
      i = 0
      screenIndex++
    }
  }
  if (screen === 'bios') {
    i++
    if (i > 20) {
      i = 0
      screenIndex++
    }
  }
  if (screen === 'next') {
  }
}

const size = range(64)
const d = 1

const rects = flatten(
  size.map(x => size.map(y => [x * 2, y * 2, d, d]))
)

clear()

rects.forEach(rect => {
  rectFill(...rect, 6)
})

print(0, 0, 'abcdefghijklmnopqrstuvwxyz', 0)

function draw() {

  const screen = screens[screenIndex]

  // if (screen === 'glitch') {
  //   rects.forEach(rect => {
  //     rectFill(...rect, rect[0] + rect[1] * i/100)
  //   })
  // }

  // if (screen === 'stable') {
  //   rects.forEach(rect => {
  //     rectFill(...rect, rect[0])
  //   })
  // }

  // if (screen === 'bios') {
  //   rectFill(0, 0, 128, 128, 7)
  // }

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
