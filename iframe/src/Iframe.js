import React, { Component } from 'react'
import classNames from 'classnames'
import equal from 'deep-equal'
import { interval } from 'd3-timer'
import { createStore, applyMiddleware } from 'redux'
import range from 'lodash/range'
import flatten from 'lodash/flatten'
import random from 'lodash/random'
import once from 'lodash/once'
import uniqBy from 'lodash/uniqBy'
import canvasAPI from './canvasAPI/index.js'
import trimCanvas from './canvasAPI/trimCanvas.js'
import utilsAPI from './utilsAPI.js'
import validateToken from './validateToken.js'
import getUserInput from './getUserInput.js'
import './css/Iframe.css'

window.script8 = {}
window._script8 = {}

const createReducer = () => {
  // Create the reducer, with the script8 state or an empty object.
  const reducer = (state = window.script8.initialState || {}, action) => {
    switch (action.type) {
      case 'TICK': {
        if (window.script8.update) {
          const newState = JSON.parse(JSON.stringify(state))
          window.script8.update(newState, action.input)
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

    this.evalCode = this.evalCode.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.handleTimelineInput = this.handleTimelineInput.bind(this)
    this.handleActorClick = this.handleActorClick.bind(this)
    this.handlePauseClick = this.handlePauseClick.bind(this)

    this.shadows = new Set(['document'])
    this.blacklist = new Set(['eval', 'alert', '_script8'])
    this.CANVAS_SIZE = 128
    this.keys = new Set()

    this.FPS = 60
    this.timer = null

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
      ].slice(-(this.FPS * 3))

      return next(action)
    }

    this.state = {
      game: '',
      timelineIndex: 0,
      actors: [],
      selectedActors: [],
      message: null,
      callbacks: {},
      isPaused: false,
      alteredStates: []
    }
  }

  componentDidMount () {
    // Assign various properties to global scope, for the user.
    const globals = {
      Math,
      Object,
      ...utilsAPI(),
      ...canvasAPI({
        ctx: this._canvas.getContext('2d'),
        width: this.CANVAS_SIZE,
        height: this.CANVAS_SIZE
      }),
      range,
      flatten,
      random
    }

    // Keep track of what keys we're pressing.
    document.addEventListener('keydown', ({ key }) => {
      this.keys.add(key)
    })
    document.addEventListener('keyup', ({ key }) => {
      this.keys.delete(key)
    })

    // Assign all the globals to window.
    Object.keys(globals).forEach(key => (window[key] = globals[key]))

    // Listen for callCode or validateToken parent messages.
    window.addEventListener('message', message => {
      const { type, ...payload } = message.data
      const { blacklist, shadows } = this
      // Run user code.
      if (type === 'callCode') {
        this.setState({
          game: payload.game,
          message,
          callbacks: payload.callbacks
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
    const timerCallback = () => {
      try {
        // update the redux store,
        this.store.dispatch({
          type: 'TICK',
          input: getUserInput(this.keys)
        })
        const { script8 } = window
        script8 && script8.draw && script8.draw(this.store.getState())
      } catch (e) {
        console.warn(e.message)
      }
    }
    if (this.timer) {
      this.timer.stop()
    }
    this.timer = interval(timerCallback, 1000 / this.FPS)
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

    console.log(actors)

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
      actors: [],
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
      timelineIndex,
      actors,
      selectedActors
    } = state
    const { script8 } = window

    // If we're playing,
    if (!isPaused) {
      // and the game is different,
      // evaluate user code,
      // get redux state,
      // and create redux store.
      console.log('componentDidUpdate: running play logic')
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
        console.log('setting storestate to script8.initialState')
        storeState = script8.initialState
      } else {
        console.log('setting storestate to store.getState()')
        storeState = this.store.getState()
      }
      // Now we can create the store.
      // Notice that we'll pass in reduxLogger as middleware.
      // This enables us to save each action. We'll need them for the time debugger.
      this.store = createStore(
        this.reducer,
        storeState || undefined,
        applyMiddleware(this.reduxLogger)
      )
    } else {
      // If we're paused,
      // and either game, timelineIndex, or selectedActors is different:
      if (
        !equal(isPaused, prevState.isPaused) ||
        !equal(game, prevState.game) ||
        !equal(timelineIndex, prevState.timelineIndex) ||
        !equal(selectedActors, prevState.selectedActors)
      ) {
        console.log(
          'componentDidUpdate: running paused logic, something different'
        )
        // Evaluate user code.
        this.evalCode({ ...state, shadows: shadows })

        // Create the store with the first item in reduxHistory as initial state.
        // Save that state to alteredStates.
        // Then, for all next actions in the history, dispatch the action,
        // and save resulting state to alteredStates.
        const alteredStates = []
        this.store = createStore(this.reducer, this.reduxHistory[0].state)
        alteredStates.push(this.store.getState())
        this.reduxHistory.forEach(({ state, action }) => {
          this.store.dispatch(action)
          alteredStates.push(this.store.getState())
        })

        // Get all unique actors.
        const allActors = flatten(alteredStates.map(state => state.actors))
        const actors = uniqBy(allActors, d => d.name)

        const newTimelineIndex = prevState.isPaused
          ? timelineIndex
          : alteredStates.length - 1

        // Draw the timeline index state.
        const stateToDraw = alteredStates[newTimelineIndex]
        script8.draw(stateToDraw)

        // Finally, set the store to point to the timeLineIndex altered state,
        // so that when we hit play, we can resume right from this point.
        this.store = createStore(this.reducer, stateToDraw)

        this.setState({
          alteredStates,
          actors,
          timelineIndex: newTimelineIndex
        })
      } else {
        // If the ul buttons don't have any canvases, add them!
        const buttons = [...this._ul.querySelectorAll('button')]
        const canvases = [...this._ul.querySelectorAll('canvas')]

        if (buttons.length !== canvases.length) {
          console.log(
            'componentDidUpdate: running paused logic, buttons have no canvases'
          )
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
              width: this.CANVAS_SIZE,
              height: this.CANVAS_SIZE
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
      console.log('componentDidUpdate: starting timer')
      this.startTimer()
    }

    // If we're not playing,
    // we can have several different kinds of inputs:
    // - game has changed
    // - timelineIndex has changed
    // - selectedActors has changed
    // Stop the timer (ONLY when pause was clicked).
    // Evaluate user code (ONLY when game has changed).
    // Create array of alteredStates (ONLY when game has changed).
    // Populated list of actor buttons (ONLY when game has changed).
    // Set timeline length to alteredStates' length (ONLY when pause was clicked).
    // Set timeline index to max (ONLY when pause was clicked).
    // Draw the last state, and draw selected actors (highlight timeline index actors).

    // Create array of alteredStates (ONLY when game has changed).

    // If we had a message,
    if (message) {
      // send the height to parent.
      const height = document.body.querySelector('.container').scrollHeight
      message.ports[0].postMessage({ height })
    }
  }

  render () {
    const {
      isPaused,
      actors,
      alteredStates,
      timelineIndex,
      selectedActors
    } = this.state
    // console.log(alteredStates.length)
    // hide: !this.actorsAvailable,
    // invisible: !isPaused
    return (
      <div className='Iframe'>
        <div className='container'>
          <canvas
            className='master'
            width={128}
            height={128}
            ref={_canvas => {
              this._canvas = _canvas
            }}
          />
          <div className='stats'>
            <button
              className={classNames('button play', {
                active: isPaused
              })}
              onClick={this.handlePauseClick}
            >
              {isPaused ? 'play' : 'pause'}
            </button>
            <div className='fps'>
              fps (avg): <span />
            </div>
          </div>
          <div
            className={classNames('timeline', {
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
