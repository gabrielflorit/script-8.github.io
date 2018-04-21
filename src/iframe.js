import { interval } from 'd3-timer'
import { createStore, applyMiddleware } from 'redux'
import equal from 'deep-equal'

import range from 'lodash/range'
import flatten from 'lodash/flatten'
import random from 'lodash/random'
import clamp from 'lodash/clamp'
import once from 'lodash/once'

import canvasAPI from './utils/canvasAPI/index.js'
import soundAPI from './utils/soundAPI/index.js'
import utilsAPI from './utils/utilsAPI.js'

// Create a noop for convenience.
const __noop = () => {}

const __shadows = new Set(['document'])
const __blacklist = new Set(['eval', 'alert', '_script8', '__script8'])

// Declare a timer and the function it will call.
let __timer
let __timerCallback

// Declare script8 namespace for the user's convenience,
const script8 = {}
window.script8 = script8

// a 'hidden' one,
window._script8 = {}
// and a super 'hidden' one.
window.__script8 = {}

// Initialize canvas.
const __canvas = document.querySelector('canvas')
const __size = 128
const __ctx = __canvas.getContext('2d')

// Create a globals object. We'll move all these to window a bit further down.
let __globals = {
  Math,
  Date
}

// Setup API functions.
__globals = {
  ...__globals,
  ...canvasAPI({
    ctx: __ctx,
    width: __size,
    height: __size
  }),
  ...soundAPI(),
  ...utilsAPI()
}

// Export lodash helpers.
__globals = {
  ...__globals,
  range,
  flatten,
  random,
  clamp
}

// Assign all the globals to window.
Object.keys(__globals).forEach(key => (window[key] = __globals[key]))

// Define arrow key helpers.
let __keys = new Set()

// Export arrow booleans for convenience.
let __updateableGlobals = {}
const __updateGlobals = () => {
  const { buttons } = window.navigator.getGamepads()[0] || {}

  __updateableGlobals = {
    ...__updateableGlobals,
    arrowUp: __keys.has('ArrowUp') || (buttons && buttons[12].pressed),
    arrowRight: __keys.has('ArrowRight') || (buttons && buttons[15].pressed),
    arrowDown: __keys.has('ArrowDown') || (buttons && buttons[13].pressed),
    arrowLeft: __keys.has('ArrowLeft') || (buttons && buttons[14].pressed),
    buttonA:
      __keys.has('a') ||
      (buttons && (buttons[1].pressed || buttons[2].pressed)),
    buttonB:
      __keys.has('b') ||
      (buttons && (buttons[0].pressed || buttons[3].pressed)),
    buttonStart: __keys.has('Enter') || (buttons && buttons[9].pressed),
    buttonSelect: __keys.has(' ') || (buttons && buttons[8].pressed)
  }
  // Copy updateableGlobals to window.
  Object.keys(__updateableGlobals).forEach(
    key => (window[key] = __updateableGlobals[key])
  )
}

// Keep track of what keys we're pressing.
document.addEventListener('keydown', e => {
  const keyName = e.key
  __keys.add(keyName)
})

document.addEventListener('keyup', e => {
  const keyName = e.key
  __keys.delete(keyName)
})

let __reduxHistory = []

const __reduxLogger = store => next => action => {
  const result = next(action)

  // Add this state and action to history,
  // and limit it to the most recent N entries.
  __reduxHistory = [
    ...__reduxHistory,
    {
      state: store.getState(),
      action
    }
  ].slice(-10)

  return result
}

let __previousInitialState = {}

// Output.js will call this every time the code is modified.
window._script8.callCode = ({
  game,
  songs,
  chains,
  phrases,
  run,
  isPaused,
  endCallback = __noop
}) => {
  // If we're in `run` mode, create playSong function from music data.
  // Otherwise ignore - we don't want to hear music while we code!
  window.playSong = run
    ? __globals.playSong({ songs, chains, phrases })
    : __noop

  // Make available an end function, and call the callback once.
  window.__script8.end = once(endCallback)

  try {
    // Clear the screen.
    script8.draw = () => {
      window.clear()
    }

    // Eval the supplied game.
    const shadowString = `var ${[...__shadows].join(',')}`
    // eslint-disable-next-line no-eval
    eval(`
      // Shadow variables we don't want available.
      ${shadowString}
      // The inception eval allows the user to declare vars (e.g. screen).
      eval(game)
    `)

    // If it's paused,
    if (isPaused) {
      // stop and destroy the timer.
      if (__timer) {
        __timer.stop()
        __timer = null
      }

      const alteredStates = []

      // Create the store with the first item in reduxHistory
      // as the initial state.
      script8.store = createStore(script8.reducer, __reduxHistory[0].state)

      // Save that state to alteredStates.
      alteredStates.push(script8.store.getState())

      // Then, for all next actions in the history,
      // dispatch it,
      // and save the resulting state to alteredStates.
      __reduxHistory.slice(1).forEach(({ state, action }) => {
        script8.store.dispatch(action)
        alteredStates.push(script8.store.getState())
      })

      // Now we have all the alteredStates.

      // Set the user state to the last one, and draw everything.
      script8.state = alteredStates[alteredStates.length - 1]
      script8.draw()

      // Then set the user state to the first one,
      // and for each altered state,
      // draw the actors, with a bit of transparency.
      // Make sure to draw the actors fully opaque if we're on the last state.
      alteredStates.forEach(state => {
        script8.state = state
        script8.drawActors()
      })
    } else {
      // If the user has changed script8.initialState, use that.
      let __storeState
      if (!equal(script8.initialState, __previousInitialState)) {
        __storeState = script8.initialState
      } else {
        // If they haven't, try using the state from existing store.
        __storeState = script8.store && script8.store.getState()
      }
      // Save the user's script8.initialState so we have it for later.
      __previousInitialState = script8.initialState

      // Use the current state to (re)create the store.
      // TODO: do we have to expose store?
      script8.store = createStore(
        script8.reducer,
        __storeState || undefined,
        applyMiddleware(__reduxLogger)
      )

      // Reassign a timer callback. Every tick,
      __timerCallback = () => {
        try {
          // update globals (e.g. what's pressed),
          __updateGlobals()

          // TODO: is exposing update necessary?
          // call update (this fires the tick action),
          script8.update && script8.update()

          // expose the state,
          script8.state = script8.store.getState()

          // and call draw.
          script8.draw && script8.draw()
        } catch (e) {
          // If there is an error, print it as a warning.
          console.warn(e.message)
        }
      }

      // If we haven't created a timer yet,
      // do so now.
      if (!__timer) {
        __timer = interval(__timerCallback, 1000 / 30)
      }
    }
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
  if (__blacklist.has(token)) {
    isValid = false
  } else if (
    // If user types a token defined in globals or updateableGlobals,
    // it's valid.
    Object.keys(__globals).indexOf(token) > -1 ||
    Object.keys(__updateableGlobals).indexOf(token) > -1 ||
    token === 'script8'
  ) {
    isValid = true
  } else if (window.hasOwnProperty(token)) {
    // If user types a token on window scope (e.g. `screen`),
    // add it to the list of __shadows, and make it valid.
    __shadows.add(token)
    isValid = true
  } else {
    // Otherwise, return valid.
    isValid = true
  }

  return isValid
}
