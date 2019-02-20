import React, { Component } from 'react'
import classNames from 'classnames'
import equal from 'deep-equal'
import * as Tone from 'tone'
import { interval } from 'd3-timer'
import { createStore, applyMiddleware } from 'redux'
import _ from 'lodash'
import range from 'lodash/range'
import flatten from 'lodash/flatten'
import random from 'lodash/random'
import clamp from 'lodash/clamp'
import once from 'lodash/once'
import uniqBy from 'lodash/uniqBy'
import isEmpty from 'lodash/isEmpty'
import StateMachine from 'javascript-state-machine'
import soundAPI from './soundAPI/index.js'
import canvasAPI from './canvasAPI/index.js'
import trimCanvas from './canvasAPI/trimCanvas.js'
import log from './log.js'
import validateToken from './validateToken.js'
import getUserInput from './getUserInput.js'
import createReducer from './createReducer.js'
import skeleton from './skeleton.js'
import './css/Iframe.css'
import { version } from '../package.json'

console.log(JSON.stringify(`SCRIPT-8 iframe v ${version}`, null, 2))

const getUniqueErrorMessages = errors =>
  _(errors)
    .map((message, type) => ({ type, message }))
    .filter(d => d.message && d.type)
    .sortBy('type')
    .uniqBy('message')
    .value()

window.initialState = null
window.update = null
window.drawActors = null
window.draw = null
window._script8 = {
  globalKeys: new Set()
}

const NOOP = () => {}
const FPS = 60
const SECONDS = 2
const CANVAS_SIZE = 128
const ACTOR_FRAME_SKIP = 5

class Iframe extends Component {
  constructor(props) {
    super(props)

    this.ArrowUpElement = null
    this.setArrowUpRef = e => {
      this.ArrowUpElement = e
    }
    this.ArrowRightElement = null
    this.setArrowRightRef = e => {
      this.ArrowRightElement = e
    }
    this.ArrowDownElement = null
    this.setArrowDownRef = e => {
      this.ArrowDownElement = e
    }
    this.ArrowLeftElement = null
    this.setArrowLeftRef = e => {
      this.ArrowLeftElement = e
    }
    this.aElement = null
    this.setaRef = e => {
      this.aElement = e
    }
    this.bElement = null
    this.setbRef = e => {
      this.bElement = e
    }
    this.EnterElement = null
    this.setEnterRef = e => {
      this.EnterElement = e
    }
    this.SpaceElement = null
    this.setSpaceRef = e => {
      this.SpaceElement = e
    }

    this.touchstartArrowUp = this.touchstartArrowUp.bind(this)
    this.touchstartArrowRight = this.touchstartArrowRight.bind(this)
    this.touchstartArrowDown = this.touchstartArrowDown.bind(this)
    this.touchstartArrowLeft = this.touchstartArrowLeft.bind(this)
    this.touchstarta = this.touchstarta.bind(this)
    this.touchstartb = this.touchstartb.bind(this)
    this.touchstartEnter = this.touchstartEnter.bind(this)
    this.touchstartSpace = this.touchstartSpace.bind(this)

    this.touchendArrowUp = this.touchendArrowUp.bind(this)
    this.touchendArrowRight = this.touchendArrowRight.bind(this)
    this.touchendArrowDown = this.touchendArrowDown.bind(this)
    this.touchendArrowLeft = this.touchendArrowLeft.bind(this)
    this.touchenda = this.touchenda.bind(this)
    this.touchendb = this.touchendb.bind(this)
    this.touchendEnter = this.touchendEnter.bind(this)
    this.touchendSpace = this.touchendSpace.bind(this)

    this.updateGlobals = this.updateGlobals.bind(this)
    this.evalCode = this.evalCode.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.handleTimelineInput = this.handleTimelineInput.bind(this)
    this.handleActorClick = this.handleActorClick.bind(this)
    this.handlePauseClick = this.handlePauseClick.bind(this)
    this.handleRestartClick = this.handleRestartClick.bind(this)
    this.logger = this.logger.bind(this)
    this.loggerErrors = {}

    this.heightSent = 0

    this.shadows = new Set(['document'])
    this.blacklist = new Set(['eval', 'alert', '_script8'])
    this.keys = new Set()

    this.timer = null
    this.previousElapsed = 0
    this.fpsValues = []

    this.volumeNode = new Tone.Volume()

    this.reducer = createReducer(this.logger)
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

    this.soundFunctions = null
    this.songSequences = null

    this.state = {
      fps: null,
      game: '',
      sprites: {},
      map: {},
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
      sound: true
    }
  }

  logger({ type, error = null }) {
    const { message, run } = this.state
    // If we have an error,
    if (error) {
      const errorMessage = error.message
      // and it is different than the previous one,
      if (this.loggerErrors[type] !== errorMessage) {
        // update the loggerErrors,
        this.loggerErrors[type] = errorMessage
        // and send to parent.
        message.ports[0].postMessage({
          errors: getUniqueErrorMessages(this.loggerErrors)
        })
      }
    } else {
      // If we don't have an error,
      // and we had one before,
      if (this.loggerErrors[type]) {
        // update the loggerErrors for this type,
        this.loggerErrors[type] = null
        // and send to parent.
        message.ports[0].postMessage({
          errors: getUniqueErrorMessages(this.loggerErrors)
        })
      }
    }

    // If we're on run mode,
    if (run) {
      // create one string with all the unique error messages.
      const errorMessages = getUniqueErrorMessages(this.loggerErrors)
        .map(({ message }) => `error: ${message}`)
        .join('. ')

      if (errorMessages.length) {
        // Print the error message in black, offset.
        range(5).forEach(x =>
          range(5).forEach(y => window.print(-2 + x, -2 + y, errorMessages, 7))
        )
        // Now print the error message in white.
        window.print(0, 0, errorMessages, 0)
      }
    }
  }

  touchstartArrowUp() {
    this.ArrowUpElement.classList.add('on')
    this.keys.add('ArrowUp')
  }
  touchstartArrowRight() {
    this.ArrowRightElement.classList.add('on')
    this.keys.add('ArrowRight')
  }
  touchstartArrowDown() {
    this.ArrowDownElement.classList.add('on')
    this.keys.add('ArrowDown')
  }
  touchstartArrowLeft() {
    this.ArrowLeftElement.classList.add('on')
    this.keys.add('ArrowLeft')
  }
  touchstarta() {
    this.aElement.classList.add('on')
    this.keys.add('a')
  }
  touchstartb() {
    this.bElement.classList.add('on')
    this.keys.add('b')
  }
  touchstartEnter() {
    this.EnterElement.classList.add('on')
    this.keys.add('Enter')
  }
  touchstartSpace() {
    this.SpaceElement.classList.add('on')
    this.keys.add(' ')
  }

  touchendArrowUp() {
    this.ArrowUpElement.classList.remove('on')
    this.keys.delete('ArrowUp')
  }
  touchendArrowRight() {
    this.ArrowRightElement.classList.remove('on')
    this.keys.delete('ArrowRight')
  }
  touchendArrowDown() {
    this.ArrowDownElement.classList.remove('on')
    this.keys.delete('ArrowDown')
  }
  touchendArrowLeft() {
    this.ArrowLeftElement.classList.remove('on')
    this.keys.delete('ArrowLeft')
  }
  touchenda() {
    this.aElement.classList.remove('on')
    this.keys.delete('a')
  }
  touchendb() {
    this.bElement.classList.remove('on')
    this.keys.delete('b')
  }
  touchendEnter() {
    this.EnterElement.classList.remove('on')
    this.keys.delete('Enter')
  }
  touchendSpace() {
    this.SpaceElement.classList.remove('on')
    this.keys.delete(' ')
  }

  updateGlobals(providedGlobals) {
    // Assign various properties to global scope, for the user.
    let globals

    if (!providedGlobals) {
      globals = {
        StateMachine,
        Math,
        Object,
        Array,
        log,
        ...canvasAPI({
          ctx: this._canvas.getContext('2d'),
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
          sprites: this.state.sprites,
          map: this.state.map
        }),
        range,
        flatten,
        random,
        clamp
      }
    } else {
      globals = providedGlobals
    }

    // For each global key,
    Object.keys(globals).forEach(key => {
      // assign the corresponding global object to window,
      window[key] = globals[key]

      // and assign the key itself to window._script8.globalKeys.
      window._script8.globalKeys.add(key)
    })
  }

  componentDidMount() {
    this.updateGlobals()
    this.soundFunctions = soundAPI(this.volumeNode)
    this.updateGlobals({
      playSong: this.soundFunctions.playSong,
      playPhrase: this.soundFunctions.playPhrase,
      stopSong: this.soundFunctions.stopSong
    })

    // Keep track of what keys we're pressing.
    this.mousedownHandler = () => {
      this.keys.add('mousedown')
    }
    this.mouseupHandler = () => {
      this.keys.delete('mousedown')
    }
    this.keydownHandler = ({ key }) => {
      this.keys.add(key)
    }
    this.keyupHandler = ({ key }) => {
      this.keys.delete(key)
    }

    document.addEventListener('touchstart', this.mousedownHandler)
    document.addEventListener('mousedown', this.mousedownHandler)
    document.addEventListener('touchend', this.mouseupHandler)
    document.addEventListener('mouseup', this.mouseupHandler)
    document.addEventListener('keydown', this.keydownHandler)
    document.addEventListener('keyup', this.keyupHandler)

    // Listen for callCode or validateToken parent messages.
    window.addEventListener('message', message => {
      const { type, ...payload } = message.data
      const { blacklist, shadows } = this

      // Run user code.
      if (type === 'callCode') {
        let isPaused = payload.run === true ? false : this.state.isPaused

        // If we're in run mode (e.g. BOOT or RUN screens),
        // and we're paused,
        // and the timer already exists (e.g. we came here from CODE),
        // resume.
        if (payload.run && this.state.isPaused) {
          this.handlePauseClick()
          isPaused = false
        }

        // If we're paused, and this is a new cassette,
        // and it wasn't new before, resume.
        if (this.state.isPaused && payload.isNew && !this.state.isNew) {
          this.handlePauseClick()
          isPaused = false
        }

        this.setState({
          game: payload.game,
          sprites: payload.sprites,
          map: payload.map,
          message,
          run: payload.run,
          isPaused,
          sound: payload.sound,
          callbacks: payload.callbacks,
          phrases: payload.phrases,
          chains: payload.chains,
          songs: payload.songs,
          isNew: payload.isNew
        })
      } else if (type === 'findInvalidToken') {
        // Find the first invalid token in the provided tokens array.
        const invalidTokenIndex = payload.tokens.findIndex(
          token =>
            !validateToken({
              token,
              blacklist,
              globals: window._script8.globalKeys,
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

  componentWillUnmount() {
    document.removeEventListener('touchstart', this.mousedownHandler)
    document.removeEventListener('mousedown', this.mousedownHandler)
    document.removeEventListener('touchend', this.mouseupHandler)
    document.removeEventListener('mouseup', this.mouseupHandler)
    document.removeEventListener('keydown', this.keydownHandler)
    document.removeEventListener('keyup', this.keyupHandler)
  }

  evalCode() {
    const { shadows, state } = this
    // eslint-disable-next-line no-unused-vars
    const { game, message, callbacks } = state
    try {
      // Make available an end function, and call the callback once.
      window._script8.end = once(() => {
        if (Tone.context.state !== 'running') {
          Tone.start()
        }
        message.ports[0].postMessage({
          callback: callbacks.endCallback
        })
      })
      // Save previous initial state.
      this.previousInitialState = window.initialState
      // Eval the supplied game.
      const shadowString = `var ${[...shadows].join(',')}`
      // eslint-disable-next-line no-unused-vars
      const innerSkeleton = skeleton
      // eslint-disable-next-line no-eval
      eval(`
      // Shadow variables we don't want available.
      ${shadowString}
      // The inception eval allows the user to declare vars (e.g. screen).
      eval(innerSkeleton)
      eval(game)
      if (initialState && typeof initialState === 'function') {
        initialState = this.previousInitialState
      }
    `)
      this.logger({ type: 'evalCode' })
    } catch (e) {
      this.logger({ type: 'evalCode', error: e })
    }
  }

  stopTimer() {
    if (this.timer) {
      this.timer.stop()
    }
  }

  startTimer() {
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
        const userInput = getUserInput(this.keys)
        this.store.dispatch({
          type: 'TICK',
          input: userInput,
          elapsed: tickLength
        })

        // Draw this state.
        window.draw && window.draw(this.store.getState())

        // Update fps, only if we had a new measurement.
        if (newFps !== undefined && newFps !== this.state.fps) {
          this.setState({
            fps: newFps
          })
        }
        this.logger({ type: 'startTimer' })
      } catch (e) {
        this.logger({ type: 'startTimer', error: e })
      }
    }
    if (this.timer) {
      this.timer.stop()
    }
    this.previousElapsed = 0
    this.timer = interval(timerCallback, 1000 / FPS)
  }

  handleTimelineInput(e) {
    this.setState({
      timelineIndex: +e.target.value
    })
  }

  handleActorClick(actorName) {
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

  handleRestartClick() {
    window.initialState = Date.now()
    this.reduxHistory = []
    this.forceUpdate()
  }

  handlePauseClick() {
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
  componentDidUpdate(prevProps, prevState) {
    const { state, shadows } = this
    const {
      message,
      isPaused,
      game,
      sprites,
      map,
      timelineIndex,
      actors,
      selectedActors,
      sound,
      songs,
      chains,
      phrases,
      run
    } = state

    // If the sprites or map have changed, update the globals.
    if (!equal(sprites, prevState.sprites) || !equal(map, prevState.map)) {
      this.updateGlobals()
    }

    // If soundon/soundoff has changed,
    // toggle volume.
    // Also resume AudioContext IF it's not running.
    if (!equal(sound, prevState.sound)) {
      Tone.Master.mute = !sound
    }

    // If the music data changed,
    if (
      !equal(songs, prevState.songs) ||
      !equal(chains, prevState.chains) ||
      !equal(phrases, prevState.phrases)
    ) {
      // make sequences,
      this.soundFunctions.makeSongs({
        songs,
        chains,
        phrases
      })
      // and restart game.
      this.handleRestartClick()
    }

    // If we are not on a run screen,
    if (!run) {
      // mute the volume node.
      this.volumeNode.mute = true
    } else {
      // If we are on the run screen,
      // unmute the volume node.
      this.volumeNode.mute = false
    }

    // If we're playing,
    if (!isPaused) {
      // and we came back from being paused, or the game is different,
      // or the run mode was different,
      if (
        prevState.isPaused ||
        game !== prevState.game ||
        run !== prevState.run ||
        !equal(window.initialState, this.previousInitialState)
      ) {
        // evaluate user code,
        // get redux state,
        // and create redux store.

        // Evaluate user code.
        this.evalCode({ ...state, shadows })

        // Before we create a redux store, let's think about what state we want.
        // If the user has changed initialState, use that.
        // This way we let the user start over when they modify initialState.
        // This is an escape hatch of sorts.
        // Otherwise use the current store state. This will enable us to modify game
        // code and not lose game state.
        let storeState
        if (!equal(window.initialState, this.previousInitialState)) {
          storeState = window.initialState
          this.reduxHistory = []
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
        !equal(map, prevState.map) ||
        !equal(timelineIndex, prevState.timelineIndex) ||
        !equal(selectedActors, prevState.selectedActors)
      ) {
        try {
          if (this.reduxHistory.length) {
            // Evaluate user code.
            this.evalCode({ ...state, shadows })

            // Create the store with the first item in reduxHistory as initial state.
            // Save that state to alteredStates.
            // Then, for all next actions in the history, dispatch the action,
            // and save resulting state to alteredStates.
            let alteredStates = []
            this.store = createStore(this.reducer, this.reduxHistory[0].state)
            alteredStates.push(this.store.getState())

            this.reduxHistory.forEach(({ state, action }, i) => {
              if (i === timelineIndex - 1) {
                // Enable logging only if this is the selected frame.
                this.updateGlobals({ log })
              } else {
                this.updateGlobals({ log: NOOP })
              }
              this.store.dispatch(action)
              alteredStates.push(this.store.getState())
            })

            // Re-enable logging.
            this.updateGlobals({ log })

            alteredStates = alteredStates.filter(d => !isEmpty(d))

            // If we were previously in pause mode,
            // use the provided timelineIndex.
            // Otherwise,
            // set the timeline to the max.
            const newTimelineIndex = prevState.isPaused
              ? timelineIndex
              : alteredStates.length - 1

            // Draw the timeline index state.
            const stateToDraw = alteredStates[newTimelineIndex]
            window.draw(stateToDraw)

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
                // Disable logging during window.draw calls.
                this.updateGlobals({ log: NOOP })
                window.drawActors &&
                  window.drawActors({ actors: matchingActors }, true)
                // Re-enable console.log.
                this.updateGlobals({ log })
              }
            })

            // Draw the timeLineIndex one last, not faded.
            const lastAlteredState = alteredStates[newTimelineIndex]
            if (window.drawActors && lastAlteredState.actors) {
              window.drawActors({
                actors: lastAlteredState.actors.filter(d =>
                  selectedActors.includes(d.name)
                )
              })
            }

            // Finally, set the store to point to the timeLineIndex altered state,
            // so that when we hit play, we can resume right from this point.
            this.store = createStore(this.reducer, stateToDraw)

            this.setState({
              alteredStates,
              actors,
              timelineIndex: newTimelineIndex
            })
          }
          this.logger({ type: 'isPaused' })
        } catch (e) {
          this.logger({ type: 'isPaused', error: e })
        }
      } else {
        // If the ul buttons don't have any canvases, add them!
        const buttons = [...this._ul.querySelectorAll('button')]
        const canvases = [...this._ul.querySelectorAll('canvas')]

        if (buttons.length !== canvases.length) {
          let tempCtx = this._canvas.getContext('2d')
          actors.forEach((actor, i) => {
            tempCtx.save()
            tempCtx.setTransform(1, 0, 0, 1, 0, 0)
            tempCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

            // For each actor,
            // draw it on the canvas,
            window.drawActors({
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

          window.draw(this.store.getState())
          tempCtx.restore()
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

  render() {
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
      <div className="Iframe">
        <div className="container">
          <canvas
            className="master"
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            ref={_canvas => {
              this._canvas = _canvas
            }}
          />

          <div
            className={classNames('mobile-buttons', {
              hide: !run
            })}
          >
            <div
              ref={this.setArrowLeftRef}
              className="button left"
              onTouchStart={this.touchstartArrowLeft}
              onTouchEnd={this.touchendArrowLeft}
            >
              &lt;
            </div>
            <div
              ref={this.setArrowUpRef}
              className="button up"
              onTouchStart={this.touchstartArrowUp}
              onTouchEnd={this.touchendArrowUp}
            >
              <span>&gt;</span>
            </div>
            <div
              ref={this.setArrowRightRef}
              className="button right"
              onTouchStart={this.touchstartArrowRight}
              onTouchEnd={this.touchendArrowRight}
            >
              &gt;
            </div>
            <div
              ref={this.setaRef}
              className="button a"
              onTouchStart={this.touchstarta}
              onTouchEnd={this.touchenda}
            >
              A
            </div>
            <div
              ref={this.setbRef}
              className="button b"
              onTouchStart={this.touchstartb}
              onTouchEnd={this.touchendb}
            >
              B
            </div>
            <div
              ref={this.setArrowDownRef}
              className="button down"
              onTouchStart={this.touchstartArrowDown}
              onTouchEnd={this.touchendArrowDown}
            >
              <span>&lt;</span>
            </div>
            <div
              ref={this.setSpaceRef}
              className="button select"
              onTouchStart={this.touchstartSpace}
              onTouchEnd={this.touchendSpace}
            >
              Select
            </div>
            <div
              ref={this.setEnterRef}
              className="button start"
              onTouchStart={this.touchstartEnter}
              onTouchEnd={this.touchendEnter}
            >
              Start
            </div>
          </div>
          <div
            className={classNames('stats', {
              hide: run
            })}
          >
            <button className="button play" onClick={this.handlePauseClick}>
              {isPaused ? 'play' : 'pause'}
            </button>

            <button
              className={classNames('button play', {
                hide: isPaused
              })}
              onClick={this.handleRestartClick}
            >
              restart
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
              type="range"
              value={timelineIndex}
              min={0}
              max={alteredStates.length - 1}
              onChange={this.handleTimelineInput}
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
