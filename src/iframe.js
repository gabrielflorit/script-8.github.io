import { interval } from 'd3-timer'

import range from 'lodash/range'
import flatten from 'lodash/flatten'
import random from 'lodash/random'
import clamp from 'lodash/clamp'
import once from 'lodash/once'

import canvasAPI from './utils/canvasAPI/index.js'
import soundAPI from './utils/soundAPI/index.js'
import blank from './utils/blank.js'
import { version } from '../package.json'

// Print version.
console.log(JSON.stringify(`SCRIPT-8 client v ${version}`, null, 2))

// Create namespaced object.
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

// Setup sound API functions.
const { playSong, stopSong } = soundAPI()
window.stopSong = stopSong

// Export api functions to global scope for eval's use later.
window.print = print
window.rectStroke = rectStroke
window.rectFill = rectFill
window.circStroke = circStroke
window.circFill = circFill
window.lineH = lineH
window.lineV = lineV
window.clear = clear

// Export lodash helpers for eval's use.
window.range = range
window.flatten = flatten
window.random = random
window.clamp = clamp

// Define arrow key helpers.
let keys = new Set()

// Export arrow booleans for convenience.
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

const noop = () => {}

// Force eval to run in global mode.
// eslint-disable-next-line no-eval
const geval = eval

let timer

window.script8.callCode = ({
  game,
  songs,
  chains,
  phrases,
  run,
  endCallback = noop
}) => {
  // If we're in `run` mode, create playSong function from music data.
  window.playSong = run ? playSong({ songs, chains, phrases }) : noop

  // Make available an end function, and call the callback once.
  window.script8.end = once(endCallback)

  // If the game is empty,
  // if (!game || !game.length) {
  //   game = blank
  // }
  try {
    // Try evaling blank first, always.
    geval(blank + ';')

    // Now eval the supplied game.
    geval(game + ';')

    // If the timer exists, stop it.
    if (timer) timer.stop()

    // Start a new timer, and:
    timer = interval(() => {
      try {
        // update the key information (i.e. what's pressed),
        updateKeys()

        // and run the game.
        geval('update && update(); draw && draw();')
      } catch (e) {
        // If there is an error, print it as a warning - no red!
        console.warn(e.message)
      }

      // If we're not operating in `run` mode, stop the timer.
      // In other words, only run this once.
      if (!run) timer.stop()
    }, 1000 / 30)
  } catch (e) {
    // If any part of this resulted in an error, print it.
    console.warn(e.message)
  }
}
