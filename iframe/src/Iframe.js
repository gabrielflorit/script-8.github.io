import React, { Component } from 'react'
import classNames from 'classnames'
import equal from 'deep-equal'
import { interval } from 'd3-timer'
import { createStore, applyMiddleware } from 'redux'
import range from 'lodash/range'
import flatten from 'lodash/flatten'
import random from 'lodash/random'
import once from 'lodash/once'
import canvasAPI from './canvasAPI/index.js'
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
    this.runTimer = this.runTimer.bind(this)
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
      message: null,
      callbacks: {},
      isPaused: false
    }
  }

  componentDidMount () {
    // Assign various properties to global scope, for the user.
    const globals = {
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
      // this.actorsAvailable = !!window.script8.initialState.actors.length
      // console.log(this.actorsAvailable)
    } catch (e) {
      // If any part of this resulted in an error, print it.
      console.warn(e.message)
    }
  }

  runTimer () {
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
      if (this.state.isPaused) {
        this.timer.stop()
      }
    }
    if (this.timer) {
      this.timer.stop()
    }
    this.timer = interval(timerCallback, 1000 / this.FPS)
  }

  // When the app's UI state has changed,
  componentDidUpdate (prevProps, prevState) {
    const { state, shadows } = this
    const { message } = state

    // If game is different,
    if (prevState.game !== state.game) {
      // evaluate user code.
      console.log('going to eval code now')
      this.evalCode({ ...state, shadows: shadows })

      // Before we create a redux store, let's think about what state we want.
      // If the user has changed script8.initialState, use that.
      // This way we let the user start over when they modify initialState.
      // This is an escape hatch of sorts.
      // Otherwise use the current store state. This will enable us to modify game
      // code and not lose game state.
      const { script8 } = window
      const storeState = !equal(script8.initialState, this.previousInitialState)
        ? script8.initialState
        : this.store.getState()
      // Now we can create the store.
      // Notice that we'll pass in reduxLogger as middleware.
      // This enables us to save each action. We'll need them for the time debugger.
      this.store = createStore(
        this.reducer,
        storeState || undefined,
        applyMiddleware(this.reduxLogger)
      )

      // re-start timer
      // Start the timer.
      this.runTimer()
    }

    // If we had a message,
    if (message) {
      // send the height to parent.
      const height = document.body.querySelector('.container').scrollHeight
      message.ports[0].postMessage({ height })
    }
  }

  handlePauseClick () {
    this.setState({
      isPaused: !this.state.isPaused
    })
  }

  render () {
    const { isPaused } = this.state
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
          <div className='stats hide'>
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
              hide: !this.actorsAvailable,
              invisible: !isPaused
            })}
          >
            <input type='range' min={0} />
          </div>
        </div>
      </div>
    )
  }
}

export default Iframe
