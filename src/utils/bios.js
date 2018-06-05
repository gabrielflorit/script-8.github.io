import { version } from '../iframe/package.json'
const boot = `

function random(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

rectFill(0, 0, 128, 128, 7)

const screens = [
  'glitch',
  'numbers',
  'pre-ram',
  'ram',
  'end'
]

let beforeTotal = Date.now()

let screenIndex = 0
let before = Date.now()

let i = 0
let delta = 1
const biosLines = range(18).map(() => {
  return '  ' + range(4).map(() => random(1000, 9999)).join('      ')
})

update = () => {

  const elapsed = Date.now() - before
  const screen = screens[screenIndex]
  i += delta

  if (screen === 'glitch' && elapsed > 500) {
    before = Date.now()
    screenIndex++
  }

  if (screen === 'numbers' && elapsed > 100) {
    before = Date.now()
    screenIndex++
    i = 0
  }

  if (screen === 'pre-ram' && elapsed > 100) {
    before = Date.now()
    screenIndex++
    i = 0
    delta = 0.5
  }

  if (screen === 'ram' && i >= 32) {
    before = Date.now()
    screenIndex++
  }

  if (screen === 'end' && elapsed > 600) {
    _script8.end()
  }
}

const size = range(128)
const d = 1

const rects = flatten(
  size.map(x => size.map(y => [x, y, d, d]))
)

draw = () => {

  const screen = screens[screenIndex]

  if (screen === 'glitch') {
    rects.forEach(rect => {
      rectFill(...rect, rect[0] + rect[1] * i/100)
    })
  }

  if (screen === 'numbers') {
    const factor = 4
    if (i % factor === 0) {
      rectFill(0, 0, 128, 128, 7)
      biosLines.forEach((line, j) => {
        print(0, 128 + 7 * j - 7 * i/factor, line, 5)
      })
    }
  }

  if (screen === 'pre-ram') {
    rectFill(0, 0, 128, 128, 7)
  }

  if (screen === 'ram') {
    rectFill(0, 0, 128, 128, 6)
    print(7, 7 * 1, 'script-8', 0)
    print(7, 7 * 3, 'bios (c) 1980 pantron inc.', 3)
    print(7, 7 * 4, 'version ${version}', 3)
    print(7, 7 * 6, 'RAM: ' + (Math.floor(i)) + ' kb', 3)

    print(7, 7 * 9, 'booting cassette ' + (Math.floor(i / 20) % 2 === 0 ? '' : '+'), 3)

    rectFill(48 + 3 * 0,  7, 3, 5, 0)
    rectFill(48 + 3 * 1,  7, 3, 5, 1)
    rectFill(48 + 3 * 2,  7, 3, 5, 2)
    rectFill(48 + 3 * 3,  7, 3, 5, 3)
    rectFill(48 + 3 * 4,  7, 3, 5, 4)
    rectFill(48 + 3 * 5,  7, 3, 5, 5)
    rectFill(48 + 3 * 6,  7, 3, 5, 4)
    rectFill(48 + 3 * 7,  7, 3, 5, 3)
    rectFill(48 + 3 * 8,  7, 3, 5, 2)
    rectFill(48 + 3 * 9,  7, 3, 5, 1)
    rectFill(48 + 3 * 10, 7, 3, 5, 0)
  }

  if (screen === 'end') {
    rectFill(0, 0, 128, 128, 6)
    print(7, 7 * 1, 'script-8', 0)
    print(7, 7 * 3, 'bios (c) 1980 pantron inc.', 3)
    print(7, 7 * 4, 'version ${version}', 3)
    print(7, 7 * 6, 'RAM: 32 kb', 3)

    print(7, 7 * 9, 'booting cassette ' + (Math.floor(i / 20) % 2 === 0 ? '' : '+'), 3)

    rectFill(48 + 3 * 0,  7, 3, 5, 0)
    rectFill(48 + 3 * 1,  7, 3, 5, 1)
    rectFill(48 + 3 * 2,  7, 3, 5, 2)
    rectFill(48 + 3 * 3,  7, 3, 5, 3)
    rectFill(48 + 3 * 4,  7, 3, 5, 4)
    rectFill(48 + 3 * 5,  7, 3, 5, 5)
    rectFill(48 + 3 * 6,  7, 3, 5, 4)
    rectFill(48 + 3 * 7,  7, 3, 5, 3)
    rectFill(48 + 3 * 8,  7, 3, 5, 2)
    rectFill(48 + 3 * 9,  7, 3, 5, 1)
    rectFill(48 + 3 * 10, 7, 3, 5, 0)
  }

}

`

export default boot
