import colors from './colors.js'
import canvasAPI from './canvasAPI.js'

const iframePadding = +window.frameElement.getAttribute('padding')
const iframeDimension =
  +window.frameElement.getAttribute('width') - iframePadding

// Initialize canvas.
const canvas = document.querySelector('canvas')

const size = 128
canvas.style.width = `${iframeDimension}px`
canvas.style.height = `${iframeDimension}px`
canvas.width = size
canvas.height = size

const ctx = canvas.getContext('2d')

// Setup canvas API functions.
const { rectStroke, rectFill, circStroke, circFill, clear } = canvasAPI({
  ctx,
  size
})

// Export them to global scope for eval's use later.
window.clear = clear
window.rectStroke = rectStroke
window.rectFill = rectFill
window.circStroke = circStroke
window.circFill = circFill

// Define arrow key helpers.
let keys = new Set()
const arrowUp = () => keys.has('ArrowUp')
const arrowRight = () => keys.has('ArrowRight')
const arrowDown = () => keys.has('ArrowDown')
const arrowLeft = () => keys.has('ArrowLeft')

// Keep track of what keys we're pressing.
document.addEventListener('keydown', e => {
  const keyName = event.key
  keys.add(keyName)
})

document.addEventListener('keyup', e => {
  const keyName = event.key
  keys.delete(keyName)
})

// Force eval to run in global mode.
const geval = eval

let timer

window.callCode = (game, run) => {
  try {
    geval(game + ';')
    if (timer) timer.stop()
    timer = d3.interval(() => {
      try {
        geval('update && update(); draw && draw();')
        if (!run) timer.stop()
      } catch (e) {
        console.error(e.message)
      }
    }, 1000 / 30)
  } catch (e) {
    console.error(e.message)
  }
}

console.log('yello')