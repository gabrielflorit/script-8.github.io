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

// Create namespaced object so the parent can call it.
window.script8 = {}

// Create a globals object. We'll move all these to window a bit further down.
let globals = {}

// Initialize canvas.
const canvas = document.querySelector('canvas')
const size = 128
const ctx = canvas.getContext('2d')

// Setup canvas API functions.
globals = {
  ...globals,
  ...canvasAPI({
    ctx,
    width: size,
    height: size
  })
}

// Setup sound API functions.
globals = {
  ...globals,
  ...soundAPI()
}

// Export lodash helpers.
globals = {
  ...globals,
  range,
  flatten,
  random,
  clamp
}

// Define arrow key helpers.
let keys = new Set()

// Export arrow booleans for convenience.
let updatedGlobals = {}
const updateGlobals = () => {
  updatedGlobals = {
    ...updatedGlobals,
    arrowUp: keys.has('ArrowUp'),
    arrowRight: keys.has('ArrowRight'),
    arrowDown: keys.has('ArrowDown'),
    arrowLeft: keys.has('ArrowLeft')
  }
  Object.keys(updatedGlobals).forEach(
    key => (window[key] = updatedGlobals[key])
  )
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

// Create a noop for convenience.
const noop = () => {}

// Force eval to run in global mode.
// eslint-disable-next-line no-eval
const geval = eval

// Declare a timer.
let timer

// Assign all the globals to window.
Object.keys(globals).forEach(key => (window[key] = globals[key]))

// A user can only type tokens that are either:
// - explicitly defined (e.g. in globals or updatedGlobals)
// - not defined in the global context
window.script8.validateToken = token =>
  Object.keys(globals).indexOf(token) > -1 ||
  Object.keys(updatedGlobals).indexOf(token) > -1 ||
  !window.hasOwnProperty(token)

// This is the function the parent will call every time game code is modified.
window.script8.callCode = ({
  game,
  songs,
  chains,
  phrases,
  run,
  endCallback = noop
}) => {
  // If we're in `run` mode, create playSong function from music data.
  window.playSong = run ? globals.playSong({ songs, chains, phrases }) : noop

  // Make available an end function, and call the callback once.
  window.script8.end = once(endCallback)

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
        // update globals (e.g. what's pressed),
        updateGlobals()

        // and run the game.
        geval('update && update(); draw && draw();')
      } catch (e) {
        // If there is an error, print it as a warning.
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
