import React, { Component } from 'react'
import classNames from 'classnames'
import equal from 'deep-equal'
import * as Tone from 'tone'
import { interval } from 'd3-timer'
import { createStore, applyMiddleware } from 'redux'
import range from 'lodash/range'
import flatten from 'lodash/flatten'
import random from 'lodash/random'
import clamp from 'lodash/clamp'
import once from 'lodash/once'
import uniqBy from 'lodash/uniqBy'
import isEmpty from 'lodash/isEmpty'
import soundAPI from './soundAPI/index.js'
import canvasAPI from './canvasAPI/index.js'
import trimCanvas from './canvasAPI/trimCanvas.js'
import utilsAPI from './utilsAPI.js'
import validateToken from './validateToken.js'
import getUserInput from './getUserInput.js'
import './css/Iframe.css'
import { version } from '../package.json'

console.log(JSON.stringify(`SCRIPT-8 iframe v ${version}`, null, 2))

window.script8 = {}
window._script8 = {}

const NOOP = () => {}
const FPS = 60
const SECONDS = 2
const CANVAS_SIZE = 128
const ACTOR_FRAME_SKIP = 5

const createReducer = () => {
  // Create the reducer, with the script8 state or an empty object.
  const reducer = (state = window.script8.initialState || {}, action) => {
    switch (action.type) {
      case 'TICK': {
        if (window.script8.update) {
          let newState
          try {
            newState = JSON.parse(JSON.stringify(state))
            window.script8.update(newState, action.input, action.elapsed)
            if (newState.actors) {
              // Find actors with no name.
              const namelessActors = newState.actors.filter(
                actor => !actor.name
              )
              if (namelessActors.length) {
                console.warn('Error: actors must have a name property.')
              }
            }
          } catch (e) {
            console.warn(e.message)
            return state
          }
          return newState
        } else {
          return state
        }
      }
      default:
        return state
    }
  }
  return reducer
}

class Iframe extends Component {
  constructor (props) {
    super(props)

    this.updateGlobals = this.updateGlobals.bind(this)

    this.evalCode = this.evalCode.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.handleTimelineInput = this.handleTimelineInput.bind(this)
    this.handleActorClick = this.handleActorClick.bind(this)
    this.handlePauseClick = this.handlePauseClick.bind(this)

    this.heightSent = 0

    this.shadows = new Set(['document'])
    this.blacklist = new Set(['eval', 'alert', '_script8'])
    this.keys = new Set()

    this.timer = null
    this.previousElapsed = 0
    this.fpsValues = []

    this.reducer = createReducer()
    this.store = null
    this.previousInitialState = null
    this.reduxHistory = []
    this.reduxLogger = store => next => action => {
      // Add this state and action to history,
      // and limit it to the 3 seconds worth of entries.
      // We calculate this by using fps.
      this.reduxHistory = [
        ...this.reduxHistory,
        {
          state: store.getState(),
          action
        }
      ].slice(-(FPS * SECONDS))

      return next(action)
    }

    this.state = {
      fps: null,
      game: '',
      sprites: {},
      songs: {},
      chains: {},
      phrases: {},
      timelineIndex: 0,
      actors: [],
      selectedActors: [],
      message: null,
      callbacks: {},
      isPaused: true,
      alteredStates: [],
      run: true,
      sound: false
    }
  }

  updateGlobals (providedGlobals) {
    // Assign various properties to global scope, for the user.
    let globals

    if (!providedGlobals) {
      globals = {
        Math,
        ...utilsAPI(),
        ...canvasAPI({
          ctx: this._canvas.getContext('2d'),
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
          sprites: this.state.sprites
        }),
        range,
        flatten,
        random,
        clamp
      }
    } else {
      globals = providedGlobals
    }

    // Assign all the globals to window.
    Object.keys(globals).forEach(key => (window[key] = globals[key]))

    return globals
  }

  componentDidMount () {
    Tone.Master.mute = true
    const globals = this.updateGlobals()

    // Keep track of what keys we're pressing.
    document.addEventListener('keydown', ({ key }) => {
      this.keys.add(key)
    })
    document.addEventListener('keyup', ({ key }) => {
      this.keys.delete(key)
    })

    // Listen for callCode or validateToken parent messages.
    window.addEventListener('message', message => {
      const { type, ...payload } = message.data
      const { blacklist, shadows } = this
      // Run user code.
      if (type === 'callCode') {
        // If we haven't setup sound functions yet,
        if (!window.playSong) {
          // and we're in RUN mode,
          if (payload.run) {
            // do so now.
            this.updateGlobals(soundAPI(payload))
          } else {
            // Otherwise set to NOOP.
            this.updateGlobals({
              playSong: NOOP,
              stopSong: NOOP
            })
          }
        }

        this.setState({
          game: payload.game,
          sprites: payload.sprites,
          message,
          run: payload.run,
          isPaused: payload.run === true ? false : this.state.isPaused,
          sound: payload.sound,
          callbacks: payload.callbacks,
          phrases: payload.phrases,
          chains: payload.chains,
          songs: payload.songs
        })
      } else if (type === 'findInvalidToken') {
        // Find the first invalid token in the provided tokens array.
        const invalidTokenIndex = payload.tokens.findIndex(
          token =>
            !validateToken({
              token,
              blacklist,
              globals,
              shadows
            })
        )
        message.ports[0].postMessage(invalidTokenIndex)
      } else if (type === 'image') {
        const smallCanvas = document.createElement('canvas')
        const size = 128
        smallCanvas.width = size
        smallCanvas.height = size
        smallCanvas.getContext('2d').drawImage(this._canvas, 0, 0, size, size)
        message.ports[0].postMessage(smallCanvas.toDataURL())
      }
    })
  }

  evalCode () {
    const { shadows, state } = this
    // eslint-disable-next-line no-unused-vars
    const { game, message, callbacks } = state
    try {
      // Make available an end function, and call the callback once.
      window._script8.end = once(() => {
        message.ports[0].postMessage({
          callback: callbacks.endCallback
        })
      })
      // Save previous initial state.
      this.previousInitialState = window.script8.initialState
      // Eval the supplied game.
      const shadowString = `var ${[...shadows].join(',')}`
      // eslint-disable-next-line no-eval
      eval(`
      // Shadow variables we don't want available.
      ${shadowString}
      // The inception eval allows the user to declare vars (e.g. screen).
      eval(game)
    `)
    } catch (e) {
      // If any part of this resulted in an error, print it.
      console.warn(e.message)
    }
  }

  stopTimer () {
    if (this.timer) {
      this.timer.stop()
    }
  }

  startTimer () {
    const timerCallback = elapsed => {
      try {
        // Calculate the actual FPS,
        const tickLength = elapsed - this.previousElapsed
        const fps = Math.round(1000 / tickLength)

        // add fps to array,
        this.fpsValues.push(fps)

        // and update fps stats once per second.
        let newFps
        if (this.fpsValues.length % 60 === 0) {
          const avg =
            this.fpsValues.reduce((acc, current) => acc + current) /
            this.fpsValues.length
          newFps = Math.round(avg)
        }

        // Save current elapsed.
        this.previousElapsed = elapsed

        // Update the redux store.
        this.store.dispatch({
          type: 'TICK',
          input: getUserInput(this.keys),
          elapsed: elapsed - this.previousElapsed
        })

        // Draw this state.
        const { script8 } = window
        script8 && script8.draw && script8.draw(this.store.getState())

        // Update fps, only if we had a new measurement.
        if (newFps !== undefined && newFps !== this.state.fps) {
          this.setState({
            fps: newFps
          })
        }
      } catch (e) {
        console.warn(e.message)
      }
    }
    if (this.timer) {
      this.timer.stop()
    }
    this.previousElapsed = 0
    this.timer = interval(timerCallback, 1000 / FPS)
  }

  handleTimelineInput (e) {
    this.setState({
      timelineIndex: +e.target.value
    })
  }

  handleActorClick (actorName) {
    const { selectedActors } = this.state

    // If actorName is in selectedActors, take it out.
    // Otherwise put it in.
    const actors = selectedActors.includes(actorName)
      ? selectedActors.filter(d => d !== actorName)
      : [...selectedActors, actorName]

    this.setState({
      selectedActors: actors
    })
  }

  handlePauseClick () {
    if (this.state.isPaused) {
      this.reduxHistory = []
      this.startTimer()
    } else {
      this.stopTimer()
    }

    this.setState({
      selectedActors: [],
      actors: [],
      fps: null,
      isPaused: !this.state.isPaused
    })
  }

  // When the app's UI state has changed,
  componentDidUpdate (prevProps, prevState) {
    const { state, shadows } = this
    const {
      message,
      isPaused,
      game,
      sprites,
      timelineIndex,
      actors,
      selectedActors,
      sound
    } = state
    const { script8 } = window

    if (!equal(sprites, prevState.sprites)) {
      this.updateGlobals()
    }

    if (!equal(sound, prevState.sound)) {
      if (Tone.context.state !== 'running') {
        Tone.context.resume()
      }
      Tone.Master.mute = !sound
    }

    // If we're playing,
    if (!isPaused) {
      // and we came back from being paused, or the game is different,
      if (prevState.isPaused || game !== prevState.game) {
        // evaluate user code,
        // get redux state,
        // and create redux store.

        // Evaluate user code.
        this.evalCode({ ...state, shadows: shadows })

        // Before we create a redux store, let's think about what state we want.
        // If the user has changed script8.initialState, use that.
        // This way we let the user start over when they modify initialState.
        // This is an escape hatch of sorts.
        // Otherwise use the current store state. This will enable us to modify game
        // code and not lose game state.
        let storeState
        if (!equal(script8.initialState, this.previousInitialState)) {
          storeState = script8.initialState
        } else {
          storeState = (this.store && this.store.getState()) || {}
        }
        // Now we can create the store.
        // Notice that we'll pass in reduxLogger as middleware.
        // This enables us to save each action. We'll need them for the time debugger.
        this.store = createStore(
          this.reducer,
          storeState || undefined,
          applyMiddleware(this.reduxLogger)
        )
      }
    } else {
      // If we're not playing,
      // we can have several different kinds of inputs:
      // - game has changed
      // - sprites have changed
      // - timelineIndex has changed
      // - selectedActors has changed
      // Stop the timer (ONLY when pause was clicked).
      // Evaluate user code (ONLY when game has changed).
      // Create array of alteredStates (ONLY when game has changed).
      // Populated list of actor buttons (ONLY when game has changed).
      // Set timeline length to alteredStates' length (ONLY when pause was clicked).
      // Set timeline index to max (ONLY when pause was clicked).
      // Draw the last state, and draw selected actors (highlight timeline index actors).

      // If we're paused,
      // and either game, timelineIndex, or selectedActors is different:
      if (
        !equal(isPaused, prevState.isPaused) ||
        !equal(game, prevState.game) ||
        !equal(sprites, prevState.sprites) ||
        !equal(timelineIndex, prevState.timelineIndex) ||
        !equal(selectedActors, prevState.selectedActors)
      ) {
        try {
          if (this.reduxHistory.length) {
            // Evaluate user code.
            this.evalCode({ ...state, shadows: shadows })

            // Create the store with the first item in reduxHistory as initial state.
            // Save that state to alteredStates.
            // Then, for all next actions in the history, dispatch the action,
            // and save resulting state to alteredStates.
            let alteredStates = []
            this.store = createStore(this.reducer, this.reduxHistory[0].state)
            alteredStates.push(this.store.getState())
            this.reduxHistory.forEach(({ state, action }) => {
              this.store.dispatch(action)
              alteredStates.push(this.store.getState())
            })

            alteredStates = alteredStates.filter(d => !isEmpty(d))

            // If we were previously in play mode,
            // set the timeline to the max.
            const newTimelineIndex = prevState.isPaused
              ? timelineIndex
              : alteredStates.length - 1

            // Draw the timeline index state.
            const stateToDraw = alteredStates[newTimelineIndex]
            script8.draw(stateToDraw)

            // Get all unique actors.
            const allActors = flatten(
              alteredStates.map(state => state.actors)
            ).filter(d => d)
            const actors = uniqBy(allActors, d => d.name)

            // For each altered state, minus the timeLineIndex one,
            // draw the actors, if they're selected, faded.
            alteredStates.forEach((state, i) => {
              if (
                (i !== newTimelineIndex && i % ACTOR_FRAME_SKIP === 0) ||
                i === alteredStates.length - 1
              ) {
                const matchingActors =
                  (state.actors &&
                    state.actors.filter(d =>
                      selectedActors.includes(d.name)
                    )) ||
                  []
                script8.drawActors &&
                  script8.drawActors({ actors: matchingActors }, true)
              }
            })

            // Draw the timeLineIndex one last, not faded.
            script8.drawActors &&
              script8.drawActors({
                actors: alteredStates[newTimelineIndex].actors.filter(d =>
                  selectedActors.includes(d.name)
                )
              })

            // Finally, set the store to point to the timeLineIndex altered state,
            // so that when we hit play, we can resume right from this point.
            this.store = createStore(this.reducer, stateToDraw)

            this.setState({
              alteredStates,
              actors,
              timelineIndex: newTimelineIndex
            })
          }
        } catch (e) {
          console.warn(e.message)
        }
      } else {
        // If the ul buttons don't have any canvases, add them!
        const buttons = [...this._ul.querySelectorAll('button')]
        const canvases = [...this._ul.querySelectorAll('canvas')]

        if (buttons.length !== canvases.length) {
          actors.forEach((actor, i) => {
            window.clear()
            // For each actor,
            // draw it on the canvas,
            script8.drawActors({
              actors: [
                {
                  ...actor,
                  x: 64,
                  y: 64
                }
              ]
            })

            // get its canvas,
            const lilCanvas = trimCanvas({
              ctx: this._canvas.getContext('2d'),
              width: CANVAS_SIZE,
              height: CANVAS_SIZE
            })

            // and append to button.
            buttons[i].appendChild(lilCanvas)
          })

          script8.draw(this.store.getState())
        }
      }
    }

    // If we haven't started the timer yet, do so now.
    if (!this.timer && !isPaused) {
      this.startTimer()
    }

    // If we had a message,
    if (message) {
      // send the height to parent.
      const height = document.body.querySelector('.container').scrollHeight
      if (height !== this.heightSent) {
        message.ports[0].postMessage({ height })
        this.heightSent = height
      }
    }
  }

  render () {
    const {
      isPaused,
      actors,
      alteredStates,
      timelineIndex,
      selectedActors,
      fps,
      run
    } = this.state
    return (
      <div className='Iframe'>
        <div className='container'>
          <canvas
            className='master'
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            ref={_canvas => {
              this._canvas = _canvas
            }}
          />
          <div
            className={classNames('stats', {
              hide: run
            })}
          >
            <button
              className={classNames('button play', {
                active: isPaused
              })}
              onClick={this.handlePauseClick}
            >
              {isPaused ? 'play' : 'pause'}
            </button>
            <div
              className={classNames('fps', {
                hide: isPaused
              })}
            >
              fps (avg): <span>{fps}</span>
            </div>
          </div>
          <div
            className={classNames('timeline', {
              hide: run || alteredStates.length === 0,
              invisible: !isPaused
            })}
          >
            <input
              type='range'
              value={timelineIndex}
              min={0}
              max={alteredStates.length - 1}
              onInput={this.handleTimelineInput}
            />
            <ul
              ref={_ul => {
                this._ul = _ul
              }}
            >
              {actors.map(actor => (
                <li key={actor.name}>
                  <button
                    className={classNames({
                      active: selectedActors.includes(actor.name)
                    })}
                    onClick={() => this.handleActorClick(actor.name)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default Iframe
