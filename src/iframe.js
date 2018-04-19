import { interval } from 'd3-timer'

import range from 'lodash/range'
import flatten from 'lodash/flatten'
import random from 'lodash/random'
import clamp from 'lodash/clamp'
import once from 'lodash/once'

import canvasAPI from './utils/canvasAPI/index.js'
import soundAPI from './utils/soundAPI/index.js'
import utilsAPI from './utils/utilsAPI.js'

// Create a noop for convenience.
const noop = () => {}

const shadows = new Set(['document'])
const blacklist = new Set(['eval', 'alert', '_script8', '__script8'])

// Declare a timer.
let timer

// Declare script8 namespace for the user's convenience,
const script8 = {}
window.script8 = script8

// and a 'hidden' one (don't worry, we'll actually enforce its visibility).
window._script8 = {}
// and a super hidden one.
window.__script8 = {}

// Initialize canvas.
const canvas = document.querySelector('canvas')
const size = 128
const ctx = canvas.getContext('2d')

// Create a globals object. We'll move all these to window a bit further down.
let globals = {
  Math,
  Date
}

// Setup API functions.
globals = {
  ...globals,
  ...canvasAPI({
    ctx,
    width: size,
    height: size
  }),
  ...soundAPI(),
  ...utilsAPI()
}

// Export lodash helpers.
globals = {
  ...globals,
  range,
  flatten,
  random,
  clamp
}

// Assign all the globals to window.
Object.keys(globals).forEach(key => (window[key] = globals[key]))

// Define arrow key helpers.
let keys = new Set()

// Export arrow booleans for convenience.
let updateableGlobals = {}
const updateGlobals = () => {
  const { buttons } = window.navigator.getGamepads()[0] || {}

  updateableGlobals = {
    ...updateableGlobals,
    arrowUp: keys.has('ArrowUp') || (buttons && buttons[12].pressed),
    arrowRight: keys.has('ArrowRight') || (buttons && buttons[15].pressed),
    arrowDown: keys.has('ArrowDown') || (buttons && buttons[13].pressed),
    arrowLeft: keys.has('ArrowLeft') || (buttons && buttons[14].pressed),
    buttonA:
      keys.has('a') || (buttons && (buttons[1].pressed || buttons[2].pressed)),
    buttonB:
      keys.has('b') || (buttons && (buttons[0].pressed || buttons[3].pressed)),
    buttonStart: keys.has('Enter') || (buttons && buttons[9].pressed),
    buttonSelect: keys.has(' ') || (buttons && buttons[8].pressed)
  }
  // Copy updateableGlobals to window.
  Object.keys(updateableGlobals).forEach(
    key => (window[key] = updateableGlobals[key])
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

// Output.js will call this every time the code is modified.
window._script8.callCode = ({
  game,
  songs,
  chains,
  phrases,
  run,
  endCallback = noop
}) => {
  // If we're in `run` mode, create playSong function from music data.
  // Otherwise ignore - we don't want to hear music while we code!
  window.playSong = run ? globals.playSong({ songs, chains, phrases }) : noop

  // Make available an end function, and call the callback once.
  window.__script8.end = once(endCallback)

  try {
    // Clear the screen.
    script8.update = () => {}
    script8.draw = () => {
      window.clear()
    }

    // Eval the supplied game.
    const shadowString = `var ${[...shadows].join(',')}`
    // eslint-disable-next-line no-eval
    eval(`
      // Shadow variables we don't want available.
      ${shadowString}
      // The inception eval allows the user to declare vars (e.g. screen).
      eval(game)
    `)

    // If the timer exists, stop it.
    if (timer) timer.stop()

    // Start a new timer, and:
    timer = interval(() => {
      try {
        // update globals (e.g. what's pressed),
        updateGlobals()

        // and run the game.
        script8.update && script8.update()
        script8.draw && script8.draw()
      } catch (e) {
        // If there is an error, print it as a warning.
        console.warn(e.message)
      }

      // If we're not operating in `run` mode, stop the timer.
      // In other words, only run this once.
      if (!run) timer.stop()
    }, 1000 / 60)
  } catch (e) {
    // If any part of this resulted in an error, print it.
    console.warn(e.message)
  }
}

// Let's sandbox JS!
// This always returns true. Refactor.
window.__script8.validateToken = token => {
  let isValid

  // If user types a token in blacklist,
  // it's most definitely invalid.
  if (blacklist.has(token)) {
    isValid = false
  } else if (
    // If user types a token defined in globals or updateableGlobals,
    // it's valid.
    Object.keys(globals).indexOf(token) > -1 ||
    Object.keys(updateableGlobals).indexOf(token) > -1 ||
    token === 'script8'
  ) {
    isValid = true
  } else if (window.hasOwnProperty(token)) {
    // If user types a token on window scope (e.g. `screen`),
    // add it to the list of shadows, and make it valid.
    shadows.add(token)
    isValid = true
  } else {
    // Otherwise, return valid.
    isValid = true
  }

  return isValid
}
