import canvasAPI from './canvasAPI.js'

// Initialize canvas.
const canvas = document.querySelector('canvas')
const size = 128
const ctx = canvas.getContext('2d')

// Setup canvas API functions.
const { print, rectStroke, rectFill, circStroke, circFill, clear } = canvasAPI({
  ctx,
  size
})

// Export them to global scope for eval's use later.
window.print = print
window.rectStroke = rectStroke
window.rectFill = rectFill
window.circStroke = circStroke
window.circFill = circFill
window.clear = clear
window.range = _.range
window.flatten = _.flatten

const noop = () => {}

// Force eval to run in global mode.
const geval = eval

let timer

window.callCode = (game, run, endCallback = noop) => {
  window.end = _.once(endCallback)
  try {
    geval(game + ';')
    if (timer) timer.stop()
    timer = d3.interval(() => {
      try {
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

// // Define arrow key helpers.
// let keys = new Set()
// const arrowUp = () => keys.has('ArrowUp')
// const arrowRight = () => keys.has('ArrowRight')
// const arrowDown = () => keys.has('ArrowDown')
// const arrowLeft = () => keys.has('ArrowLeft')

// // Keep track of what keys we're pressing.
// document.addEventListener('keydown', e => {
//   const keyName = event.key
//   keys.add(keyName)
// })

// document.addEventListener('keyup', e => {
//   const keyName = event.key
//   keys.delete(keyName)
// })
