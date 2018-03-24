import { interval } from 'd3-timer'

import range from 'lodash/range'
import flatten from 'lodash/flatten'
import random from 'lodash/random'
import clamp from 'lodash/clamp'
import once from 'lodash/once'

import canvasAPI from './utils/canvasAPI/index.js'
import soundAPI from './utils/soundAPI/index.js'
import blank from './utils/blank.js'

window.script8 = {}

// Initialize canvas.
const canvas = document.querySelector('canvas')
const size = 128
const ctx = canvas.getContext('2d')

// Setup canvas API functions.
const {
  print,
  rectStroke,
  rectFill,
  circStroke,
  circFill,
  clear,
  lineH,
  lineV
} = canvasAPI({
  ctx,
  width: size,
  height: size
})

const { playPhrase } = soundAPI()

// Export them to global scope for eval's use later.
window.print = print
window.rectStroke = rectStroke
window.rectFill = rectFill
window.circStroke = circStroke
window.circFill = circFill
window.lineH = lineH
window.lineV = lineV
window.clear = clear

window.range = range
window.flatten = flatten
window.random = random
window.clamp = clamp

// Define arrow key helpers.
let keys = new Set()

const updateKeys = () => {
  window.arrowUp = keys.has('ArrowUp')
  window.arrowRight = keys.has('ArrowRight')
  window.arrowDown = keys.has('ArrowDown')
  window.arrowLeft = keys.has('ArrowLeft')
}

// Keep track of what keys we're pressing.
document.addEventListener('keydown', e => {
  const keyName = e.key
  keys.add(keyName)
})

document.addEventListener('keyup', e => {
  const keyName = e.key
  keys.delete(keyName)
})

let isMouseDown = false
document.addEventListener('mousedown', e => {
  isMouseDown = true
})

document.addEventListener('mouseup', e => {
  isMouseDown = false
})

function getOffset (event) {
  let normalizedOffset
  if (isMouseDown) {
    const rect = event.target.getBoundingClientRect()
    const { width, height } = rect
    let offset
    if ('offsetX' in event) {
      offset = [event.offsetX, event.offsetY]
    } else {
      offset = [event.clientX - rect.left, event.clientY - rect.top]
    }
    normalizedOffset = [offset[0] * size / width, offset[1] * size / height]
  }
  return normalizedOffset
}

window.getOffset = getOffset

const noop = () => {}

// Force eval to run in global mode.
// eslint-disable-next-line no-eval
const geval = eval

let timer

window.script8.callCode = ({ game, phrases, run, endCallback = noop }) => {
  window.playPhrase = playPhrase(phrases)
  window.script8.end = once(endCallback)
  if (!game || !game.length) {
    game = blank
  }
  try {
    geval(game + ';')
    geval(`
      document.querySelector('canvas').onmousemove = e => {
        if (window.onMouseMove) {
          const offset = window.getOffset(e)
          if (offset) {
            window.onMouseMove(offset)
          }
        }
      };
    `)
    if (timer) timer.stop()
    timer = interval(() => {
      try {
        updateKeys()
        geval('update && update(); draw && draw();')
      } catch (e) {
        console.warn(e.message)
      }
      if (!run) timer.stop()
    }, 1000 / 30)
  } catch (e) {
    console.error(e.message)
  }
}
