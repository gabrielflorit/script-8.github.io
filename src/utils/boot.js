import { version } from '../../package.json'
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
  'prenumbers',
  'numbers',
  'pre-complete',
  'complete',
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

function update() {

  const elapsed = Date.now() - before
  const screen = screens[screenIndex]
  i += delta

  if (screen === 'glitch' && elapsed > 1250) {
    before = Date.now()
    screenIndex++
  }

  if (screen === 'stable' && elapsed > 600) {
    before = Date.now()
    screenIndex++
  }

  if (screen === 'prenumbers' && elapsed > 50) {
    before = Date.now()
    screenIndex++
  }

  if (screen === 'numbers' && elapsed > 500) {
    before = Date.now()
    screenIndex++
    i = 0
  }

  if (screen === 'pre-complete' && elapsed > 100) {
    before = Date.now()
    screenIndex++
    i = 0
  }

  if (screen === 'complete' && elapsed > 1000) {
    before = Date.now()
    screenIndex++
  }

  if (screen === 'end') {
    delta = 0
    console.log(before - beforeTotal)
  }
}

const size = range(128)
const d = 1

const rects = flatten(
  size.map(x => size.map(y => [x, y, d, d]))
)

function draw() {

  const screen = screens[screenIndex]

  if (screen === 'glitch') {
    rects.forEach(rect => {
      rectFill(...rect, rect[0] + rect[1] * i/100)
    })
  }

  if (screen === 'stable') {
    rects.forEach(rect => {
      rectFill(...rect, rect[0])
    })
  }

  if (screen === 'prenumbers') {
    rectFill(0, 0, 128, 128, 7)
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

  if (screen === 'pre-complete') {
    rectFill(0, 0, 128, 128, 7)
  }

  if (screen === 'complete') {
    rectFill(0, 0, 128, 128, 6)
    print(7, 7 * 1, 'script-8', 0)
    print(7, 7 * 3, 'bios (c) 1980 pantron inc.', 3)
    print(7, 7 * 4, 'version ${version}', 3)
    print(7, 7 * 6, "loading RAM: " + (i * 64) + ' kb', 3)
  }

  if (screen === 'end') {
    rectFill(0, 0, 128, 128, 6)
    print(7, 7 * 1, 'script-8', 0)
    print(7, 7 * 3, 'bios (c) 1980 pantron inc.', 3)
    print(7, 7 * 4, 'version ${version}', 3)
    print(7, 7 * 6, "loading RAM: " + (i * 64) + ' kb', 3)
    print(7, 7 * 8, 'ok', 0)
  }

}

`

export default boot