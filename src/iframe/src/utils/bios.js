import { version } from '../../package.json'
import skeleton from '../skeleton.js'
const boot = `

const modes = ['glitch', 'numbers', 'pre-ram', 'ram', 'run', 'end']

const size = range(128)
const d = 1

const rects = flatten(size.map(x => size.map(y => [x, y, d, 128])))

const biosLines = range(18).map(() => {
  return (
    '  ' +
    range(4)
      .map(() => random(1000, 9999))
      .join('      ')
  )
})

// init = state => {
//   state.counter = 0
//   state.totalElapsed = 0
//   state.modeIndex = 0
// }

let hasStarted = false
update = (state, input, elapsed) => {
  if (!hasStarted) {
    state.counter = 0
    state.totalElapsed = 0
    state.modeIndex = 0
    hasStarted = true
  }

  const mode = modes[state.modeIndex]

  state.counter++
  state.totalElapsed += elapsed

  if (mode === 'glitch' && state.totalElapsed > 500) {
    state.modeIndex++
    state.totalElapsed = 0
  } else if (mode === 'numbers' && state.totalElapsed > 100) {
    state.modeIndex++
    state.totalElapsed = 0
  } else if (mode === 'pre-ram' && state.totalElapsed > 100) {
    state.modeIndex++
    state.totalElapsed = 0
    state.counter = 0
  } else if (mode === 'ram' && state.counter > 64 && _script8.end) {
    // The _script8.end function is not defined until we're done fetching the gist.
    state.modeIndex++
    state.totalElapsed = 0
    state.counter++
  } else if (mode === 'run') {
    if (input.__mousedown) {
      ${skeleton}
      _script8.end()
    }
  }
}

draw = state => {
  const { modeIndex, counter } = state
  const mode = modes[modeIndex]

  if (mode === 'glitch') {
    rects.forEach(rect => {
      rectFill(...rect, rect[0] + (rect[1] * counter) / 100)
    })
  }

  if (mode === 'numbers') {
    const factor = 4
    if (counter % factor === 0) {
      rectFill(0, 0, 128, 128, 7)
      biosLines.forEach((line, j) => {
        print(0, 128 + 7 * j - (7 * counter) / factor, line, 5)
      })
    }
  }

  if (mode === 'pre-ram') {
    rectFill(0, 0, 128, 128, 7)
  }

  if (mode === 'ram') {
    rectFill(0, 0, 128, 128, 6)
    print(7, 7 * 1, 'script-8', 0)
    print(7, 7 * 3, 'bios (c) 1980 pantron inc.', 3)
    print(7, 7 * 4, 'version ${version}', 3)
    print(7, 7 * 6, 'RAM: ' + Math.min(state.counter, 32) + ' kb', 3)

    print(
      7,
      7 * 9,
      'booting cassette ' +
        (Math.floor(state.counter / 20) % 2 === 0 ? '' : '+'),
      3
    )

    rectFill(48 + 3 * 0, 7, 3, 5, 0)
    rectFill(48 + 3 * 1, 7, 3, 5, 1)
    rectFill(48 + 3 * 2, 7, 3, 5, 2)
    rectFill(48 + 3 * 3, 7, 3, 5, 3)
    rectFill(48 + 3 * 4, 7, 3, 5, 4)
    rectFill(48 + 3 * 5, 7, 3, 5, 5)
    rectFill(48 + 3 * 6, 7, 3, 5, 4)
    rectFill(48 + 3 * 7, 7, 3, 5, 3)
    rectFill(48 + 3 * 8, 7, 3, 5, 2)
    rectFill(48 + 3 * 9, 7, 3, 5, 1)
    rectFill(48 + 3 * 10, 7, 3, 5, 0)
  }

  if (mode === 'run') {
    rectFill(0, 0, 128, 128, 6)
    print(7, 7 * 1, 'script-8', 0)
    print(7, 7 * 3, 'bios (c) 1980 pantron inc.', 3)
    print(7, 7 * 4, 'version ${version}', 3)
    print(7, 7 * 6, 'RAM: ' + Math.min(state.counter, 32) + ' kb', 3)

    print(7, 7 * 9, 'booting cassette done. ', 3)

    rectFill(48 + 3 * 0, 7, 3, 5, 0)
    rectFill(48 + 3 * 1, 7, 3, 5, 1)
    rectFill(48 + 3 * 2, 7, 3, 5, 2)
    rectFill(48 + 3 * 3, 7, 3, 5, 3)
    rectFill(48 + 3 * 4, 7, 3, 5, 4)
    rectFill(48 + 3 * 5, 7, 3, 5, 5)
    rectFill(48 + 3 * 6, 7, 3, 5, 4)
    rectFill(48 + 3 * 7, 7, 3, 5, 3)
    rectFill(48 + 3 * 8, 7, 3, 5, 2)
    rectFill(48 + 3 * 9, 7, 3, 5, 1)
    rectFill(48 + 3 * 10, 7, 3, 5, 0)
    print(7, 7 * 11, '> click to run', 3)
    rectFill(7, 7 * 12, 4, 5, Math.floor(state.counter / 25) % 2 ? 0 : 6)
  }
}

`

export default boot
