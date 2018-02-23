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

// rects.forEach(rect => {
//   rectFill(...rect, 6)
// })

// print(0, 7 * 0, 'alpha bravo charlie delta echo', 0)
// print(0, 7 * 1, 'foxtrot golf hotel india juliet', 0)
// print(0, 7 * 2, 'kilo lima mike november oscar', 0)
// print(0, 7 * 3, 'papa quebec romeo sierra', 0)
// print(0, 7 * 4, 'tango uniform victor whiskey', 0)
// print(0, 7 * 5, 'x-ray yankee zulu', 0)
// print(0, 7 * 6, 'i really, really like this.', 0)
// print(0, 7 * 7, 'I do! do you?', 0)

// print(0, 7 * 9, '1ou! ', 0)
print(0, 7 * 9, 'rescue the Princess? ok! i can do that.', 0)
// print(0, 7 * 10, 'You', 0)
// print(15, 7 * 10, 'have', 0)
// print(34, 7 * 10, 'to', 0)
// print(45, 7 * 10, 'rescue', 0)
// print(72, 7 * 10, 'the', 0)
// print(87, 7 * 10, 'Princess.', 0)



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