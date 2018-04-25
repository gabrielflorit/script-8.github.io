import { interval } from 'd3-timer'
import { createStore, applyMiddleware } from 'redux'
import equal from 'deep-equal'

import range from 'lodash/range'
import flatten from 'lodash/flatten'
import random from 'lodash/random'
import clamp from 'lodash/clamp'
import once from 'lodash/once'
import uniqBy from 'lodash/uniqBy'

import canvasAPI from './utils/canvasAPI/index.js'
import soundAPI from './utils/soundAPI/index.js'
import utilsAPI from './utils/utilsAPI.js'
import trimCanvas from './utils/canvasAPI/trimCanvas.js'

const FPS = 60
let __previousElapsed = 0
const __stats = document.querySelector('.stats')
const __fpsDiv = __stats.querySelector('.fps')
const __fpsSpan = __fpsDiv.querySelector('span')
let __fpsValues = []

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
const __canvas = document.querySelector('canvas.master')
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

// Export user input for convenience.
const getUserInput = () => {
  const { buttons } = window.navigator.getGamepads()[0] || {}

  return {
    up: __keys.has('ArrowUp') || (buttons && buttons[12].pressed),
    right: __keys.has('ArrowRight') || (buttons && buttons[15].pressed),
    down: __keys.has('ArrowDown') || (buttons && buttons[13].pressed),
    left: __keys.has('ArrowLeft') || (buttons && buttons[14].pressed),
    a:
      __keys.has('a') ||
      (buttons && (buttons[1].pressed || buttons[2].pressed)),
    b:
      __keys.has('b') ||
      (buttons && (buttons[0].pressed || buttons[3].pressed)),
    start: __keys.has('Enter') || (buttons && buttons[9].pressed),
    select: __keys.has(' ') || (buttons && buttons[8].pressed)
  }
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
  // Add this state and action to history,
  // and limit it to the 3 seconds worth of entries.
  // We calculate this by using fps.
  __reduxHistory = [
    ...__reduxHistory,
    {
      state: store.getState(),
      action
    }
  ].slice(-(FPS * 3))

  return next(action)
}

const __timelineDiv = document.querySelector('div.timeline')
// When we change the slider,
const __input = document.querySelector('input')
__input.addEventListener('input', e => {
  // call a function.
  __inputCallback(+e.target.value)
})

let __previousInitialState = {}
let __store
let __innerFunction
let __wasPaused = false
let __isPaused = false

// When we click the play button,
const __buttonPlay = document.querySelector('button.play')
__buttonPlay.addEventListener('click', e => {
  // change its play/pause text,
  e.target.innerHTML = e.target.innerHTML === 'play' ? 'pause' : 'play'
  // change the global __isPaused variable,
  __isPaused = !__isPaused
  // change its appearance,
  e.target.classList.toggle('active')
  // and try calling the innerFunction.
  __innerFunction && __innerFunction()
})

// Output.js will call this every time the code is modified.
window._script8.callCode = ({
  game: __game,
  songs: __songs,
  chains: __chains,
  phrases: __phrases,
  run: __run,
  heightCallback: __heightCallback,
  endCallback: __endCallback = __noop
}) => {
  // This inner closured function is here so we can call it
  // from outside - e.g., from a button.
  __innerFunction = () => {
    // If we're in `run` mode, create playSong function from music data.
    // Otherwise ignore - we don't want to hear music while we code!
    window.playSong = __run
      ? __globals.playSong({ __songs, __chains, __phrases })
      : __noop

    // Also, if we're not in run mode, remove hide from stats and timeline.
    // Note that this doesn't show them - it puts them in the DOM flow.
    // They're still hidden.
    if (!__run) {
      __stats.classList.remove('hide')
      __timelineDiv.classList.remove('hide')
    }

    // Make available an end function, and call the callback once.
    window.__script8.end = once(__endCallback)

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
      eval(__game)
    `)

      // Create the reducer, with the script8 state or an empty object.
      const __reducer = (state = script8.initialState || {}, action) => {
        switch (action.type) {
          case 'TICK': {
            if (script8.update) {
              const newState = JSON.parse(JSON.stringify(state))
              script8.update(newState, action.input)
              return newState
            } else {
              return state
            }
          }
          default:
            return state
        }
      }

      // If we have actors, show the play button.
      if (script8.initialState && script8.initialState.actors) {
        __buttonPlay.classList.remove('invisible')
      } else {
        __buttonPlay.classList.add('invisible')
      }

      // If it's paused,
      if (__isPaused) {
        // stop and destroy the timer.
        if (__timer) {
          __timer.stop()
          __timer = null
        }

        // Show the timeline.
        __timelineDiv.classList.remove('invisible')

        // Hide the fps counter.
        __fpsDiv.classList.add('invisible')

        const alteredStates = []

        // Create the store with the first item in reduxHistory
        // as the initial state.
        __store = createStore(__reducer, __reduxHistory[0].state)

        // Save that state to alteredStates.
        alteredStates.push(__store.getState())

        // Then, for all next actions in the history,
        // dispatch it,
        // and save the resulting state to alteredStates.
        __reduxHistory.forEach(({ state, action }) => {
          __store.dispatch(action)
          alteredStates.push(__store.getState())
        })

        // Get all unique actors.
        const actors = flatten(alteredStates.map(state => state.actors))
        const uniqueActors = uniqBy(actors, d => d.name)

        // Clear out ul items.
        const ul = document.querySelector('ul')
        while (ul.firstChild) {
          ul.firstChild.remove()
        }

        // Set the timeline's length.
        __input.max = alteredStates.length - 1

        // If we were previously in play mode,
        if (!__wasPaused) {
          // set the timeline to the max.
          __input.value = alteredStates.length - 1
        }

        // Create the function that will be called every time
        // the input changes.
        __inputCallback = timeLineIndex => {
          // Get all active actors.
          const activeActors = [...ul.querySelectorAll('button.active')].map(
            d => d.dataset.name
          )

          // Set the user state to the last one, and draw everything.
          script8.draw(alteredStates[alteredStates.length - 1])

          // For each altered state, minus the timeLineIndex one,
          // draw the actors, if they're selected, faded.
          alteredStates.forEach((state, i) => {
            if (
              (i !== timeLineIndex && i % 5 === 0) ||
              i === alteredStates.length - 1
            ) {
              const matchingActors = state.actors.filter(d =>
                activeActors.includes(d.name)
              )
              script8.drawActors({ actors: matchingActors }, true)
            }
          })

          // Draw the timeLineIndex one last, not faded.
          script8.drawActors({
            actors: alteredStates[timeLineIndex].actors.filter(d =>
              activeActors.includes(d.name)
            )
          })

          // Finally, set the store to point to the timeLineIndex altered state,
          // so that when we hit play, we can resume right from this point.
          __store = createStore(__reducer, alteredStates[timeLineIndex])
        }

        // Create the tiny actor buttons.
        uniqueActors.forEach(actor => {
          window.clear()

          // For each actor,
          // draw it on the canvas,
          script8.drawActors({ actors: [actor] })

          // get its canvas,
          const lilCanvas = trimCanvas({
            ctx: __ctx,
            width: __size,
            height: __size
          })

          // and create the corresponding button.
          const li = document.createElement('li')
          const button = document.createElement('button')
          button.dataset.name = actor.name

          // When the user clicks a tiny actor button,
          button.addEventListener('click', () => {
            // toggle its active state,
            button.classList.toggle('active')

            // and call the input callback.
            __inputCallback(+__input.value)
          })
          button.appendChild(lilCanvas)
          li.appendChild(button)
          ul.appendChild(li)
        })

        // Call the input callback for the first time.
        __inputCallback(+__input.value)

        // Set this so we know the previous state.
        // This is the 2nd time we need to remember previous state.
        // Maybe we should consider switching the iframe to React soon.
        __wasPaused = true
      } else {
        // Hide the timeline.
        __timelineDiv.classList.add('invisible')

        // Show the fps counter.
        __fpsDiv.classList.remove('invisible')

        __reduxHistory = []

        // If the user has changed script8.initialState, use that.
        let __storeState
        if (!equal(script8.initialState, __previousInitialState)) {
          __storeState = script8.initialState
        } else {
          // If they haven't, try using the state from existing store.
          __storeState = __store && __store.getState()
        }
        // Save the user's script8.initialState so we have it for later.
        __previousInitialState = script8.initialState

        // Use the current state to (re)create the store.
        __store = createStore(
          __reducer,
          __storeState || undefined,
          applyMiddleware(__reduxLogger)
        )

        // Reassign a timer callback. Every tick,
        __timerCallback = elapsed => {
          try {
            // calculate the actual FPS,
            const tickLength = elapsed - __previousElapsed
            const fps = Math.round(1000 / tickLength)

            // add fps to array,
            __fpsValues.push(fps)

            // update fps stats once per second,
            if (__fpsValues.length % 60 === 0) {
              const avg =
                __fpsValues.reduce((acc, current) => acc + current) /
                __fpsValues.length
              __fpsSpan.innerHTML = Math.round(avg)
            }

            __previousElapsed = elapsed

            // update the redux store,
            __store.dispatch({
              type: 'TICK',
              input: getUserInput()
            })

            // and call draw.
            script8.draw && script8.draw(__store.getState())
          } catch (e) {
            // If there is an error, print it as a warning.
            console.warn(e.message)
          }
        }

        // If we haven't created a timer yet,
        // do so now.
        if (!__timer) {
          __timer = interval(__timerCallback, 1000 / FPS)
        }

        __wasPaused = false
      }
    } catch (e) {
      // If any part of this resulted in an error, print it.
      console.warn(e.message)
    }

    // Tell the parent it should recompute the iframe height.
    __heightCallback()
  }
  __innerFunction()
}

// // Let's sandbox JS!
// // This always returns true. Refactor.
// window.__script8.validateToken = token => {
//   let isValid

//   // If user types a token in blacklist,
//   // it's most definitely invalid.
//   if (__blacklist.has(token)) {
//     isValid = false
//   } else if (
//     // If user types a token defined in globals or updateableGlobals,
//     // it's valid.
//     Object.keys(__globals).indexOf(token) > -1 ||
//     token === 'script8'
//   ) {
//     isValid = true
//   } else if (window.hasOwnProperty(token)) {
//     // If user types a token on window scope (e.g. `screen`),
//     // add it to the list of __shadows, and make it valid.
//     __shadows.add(token)
//     isValid = true
//   } else {
//     // Otherwise, return valid.
//     isValid = true
//   }

//   return isValid
// }
