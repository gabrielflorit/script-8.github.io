import React, { Component } from 'react'
import classNames from 'classnames'
import equal from 'deep-equal'
import * as Tone from 'tone'
import { interval } from 'd3-timer'
import { createStore, applyMiddleware } from 'redux'
import _ from 'lodash'
import sum from 'lodash/sum'
import range from 'lodash/range'
import flatten from 'lodash/flatten'
import random from 'lodash/random'
import clamp from 'lodash/clamp'
import once from 'lodash/once'
import uniqBy from 'lodash/uniqBy'
import isEmpty from 'lodash/isEmpty'
import chunk from 'lodash/chunk'
import bios from './utils/bios.js'
import StateMachine from 'javascript-state-machine'
import soundAPI from './soundAPI/index.js'
import { default as frameBufferCanvasAPI } from './frameBufferCanvasAPI/index.js'
import trimCanvas from './contextCanvasAPI/trimCanvas.js'
import validateToken from './validateToken.js'
import getUserInput, { allowedKeys } from './getUserInput.js'
import createReducer from './createReducer.js'
import skeleton from './skeleton.js'
import { extractGistMap } from './gistParsers/map.js'
import { extractGistSprites } from './gistParsers/sprites.js'
import { extractGistPhrases } from './gistParsers/phrases.js'
import { extractGistChains } from './gistParsers/chains.js'
import { extractGistSongs } from './gistParsers/songs.js'
import { parseGistGame, assembleOrderedGame } from './gistParsers/game.js'
import { getEvaledErrorPosition } from './utils/errorLocation.js'
import './css/Iframe.css'
import { version } from '../package.json'

// window.SCRIPT_8_EMBEDDED_GIST_ID = 'd5dacf8f639a775996c4ed9f9156d4d5'

// Get the browser platform.
const { platform } = window.navigator

// Print the SCRIPT-8 iframe version to the console.
console.log(JSON.stringify(`SCRIPT-8 iframe v ${version}`, null, 2))

// This function takes an object of errors, keyed by type, and converts them
// to an array of objects with properties { type, data },
// filters down to errors that have both type and data,
// sorts by type,
// and only keeps those with unique data.
const getUniqueErrorMessages = errors =>
  _(errors)
    .map((data, type) => ({ type, data }))
    .filter(d => d.data && d.type)
    .sortBy('type')
    .uniqBy(d => JSON.stringify(d.data))
    .value()

// These four are part of the SCRIPT-8 API.
window.init = null
window.update = null
window.drawActors = null
window.draw = null

// Create window-scoped variables under the _script8 object.
// This key will be passed to a validation function,
// to prevent the user from using them.
window._script8 = {
  embedState: {},
  reservedTokens: new Set(['init', 'update', 'drawActors', 'draw'])
}

// Convenience function.
const NOOP = () => {}

// Use this to set SCRIPT-8's desired FPS.
const FPS = 60

// Use this to set how far in the past we want to rewind.
const REDUX_HISTORY_SECONDS = 2

// Convenience constant placeholder for 128. Theoretically this could enable
// us to adjust the canvas size, but in reality this will never happen.
const CANVAS_SIZE = 128

// Number of frames to skip when drawing an actor's past. If we were to draw
// every single frame, we wouldn't be able to distinguish the actor's trail.
const ACTOR_FRAME_SKIP = 5

class Iframe extends Component {
  constructor(props) {
    super(props)

    // The following ref-binding functions set up keyboard listeners.
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

    this.addLog = this.addLog.bind(this)
    this.sendLogsToParent = this.sendLogsToParent.bind(this)
    this.logs = []
    this.sendErrorToParent = this.sendErrorToParent.bind(this)
    this.loggerErrors = {}
    this.printErrorsToCassetteScreen = this.printErrorsToCassetteScreen.bind(
      this
    )

    this.updateGlobals = this.updateGlobals.bind(this)
    this.evalCode = this.evalCode.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.handleTimelineInput = this.handleTimelineInput.bind(this)
    this.handleActorClick = this.handleActorClick.bind(this)
    this.handlePauseClick = this.handlePauseClick.bind(this)
    this.handleRestartClick = this.handleRestartClick.bind(this)

    this.heightSent = 0

    this.shadows = new Set(['document'])
    this.blacklist = new Set(['eval', 'alert', '_script8'])
    this.keys = new Set()

    this.timer = null
    this.previousElapsed = 0
    this.pastFpsValues = []

    this.volumeNode = new Tone.Volume()

    this.reducer = createReducer(this.sendErrorToParent)
    this.store = null
    this.previousInitString = null
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
      ].slice(-(FPS * REDUX_HISTORY_SECONDS))

      return next(action)
    }

    this.soundFunctions = null
    this.songSequences = null

    this.state = {
      started: false,
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
      isPaused: false,
      alteredStates: [],
      run: true,
      sound: true
    }

    // Pixel data has the actual image data object which can be passed to putImageData.
    this._pixelData = new ImageData(CANVAS_SIZE, CANVAS_SIZE)

    // This contains the actual binary data for setting on _pixelData. It cannot
    // be accessed directly, but is instead modified through TypedArrays such as
    // Uint8ClampedArray and Uint32Array. Both the TypedArrays below refer to
    // the same backing buffer, so modifying values via one will be reflected in
    // the other.
    this._pixelBuffer = new ArrayBuffer(4 * CANVAS_SIZE * CANVAS_SIZE)

    // The pixelBytes array is only used to set the data in the _pixelData
    // object. ImageData only has an Uint8ClampedArray to access the underlying
    // bytes, so a Uint8ClampedArray must be kept around to copy the data.
    this._pixelBytes = new Uint8ClampedArray(this._pixelBuffer)

    // It turns out that setting pixels all at once via a single integer is much
    // faster than setting each byte individually. So the pixel data is only
    // ever modified via the Uint32Array for performance reasons.
    this._pixelIntegers = new Uint32Array(this._pixelBuffer)
  }

  // The following event listeners add/remove css classes from the DOM elements,
  // and also add/remove keys from the input object.
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

  sendLogsToParent() {
    if (!this.isEmbed) {
      const { message, run } = this.state
      if (!run) {
        message.ports[0].postMessage({
          logs: this.logs
        })
      }
    }
    this.logs = []
  }

  // Add log to logs array.
  addLog(value) {
    // Also print to console.
    // Don't use if we're on embed mode.
    if (!this.isEmbed) {
      const { run } = this.state
      // If we have something to log,
      if (!run && !_.isNil(value)) {
        // update the logs.
        this.logs.push(value)
      }
    }
  }

  // Send error message to parent,
  // and if in RUN mode, print it to cassette screen.
  sendErrorToParent({ type, error = null }) {
    const { message, run } = this.state
    // If we have an error,
    if (error) {
      const errorData = {
        message: error.message,
        position: getEvaledErrorPosition(error)
      }

      if (errorData.message.startsWith('enhancer(...) is not a function')) {
        errorData.message = 'The init or update functions are invalid.'
      }

      // and it is different than the previous one,
      if (
        JSON.stringify(this.loggerErrors[type]) !== JSON.stringify(errorData)
      ) {
        // update the loggerErrors,
        this.loggerErrors[type] = errorData
        // and send to parent.
        if (!this.isEmbed) {
          message.ports[0].postMessage({
            errors: getUniqueErrorMessages(this.loggerErrors)
          })
        }
      }
    } else {
      // If we don't have an error, and we had one before,
      if (this.loggerErrors[type]) {
        // update the loggerErrors for this type,
        this.loggerErrors[type] = null
        // and send to parent.
        if (!this.isEmbed) {
          message.ports[0].postMessage({
            errors: getUniqueErrorMessages(this.loggerErrors)
          })
        }
      }
    }

    // If we're on run mode,
    if (run) {
      this.printErrorsToCassetteScreen()
    }
  }

  // Print errors to cassette screen.
  printErrorsToCassetteScreen() {
    // Create one string with all the unique error messages.
    const errorMessages = getUniqueErrorMessages(this.loggerErrors)
      .map(error => `error: ${error.data.message}`)
      .join('. ')

    if (errorMessages.length) {
      // Print the error message in black, offset.
      chunk(errorMessages, 32).forEach((errorMessage, i) => {
        const theString = errorMessage.join('')
        range(3).forEach(x => {
          range(3).forEach(y => {
            window.print(1 + x, 1 + y + i * 8, theString, 7)
          })
        })
        // Now print the error message in white.
        window.print(2, 2 + i * 8, theString, 0)
      })

      this.writePixelDataToCanvas()
    }
  }

  // Assign various properties to global scope, for the user.
  // Also add them to the list of reserved tokens.
  updateGlobals(providedGlobals) {
    let globals

    if (!providedGlobals) {
      const canvasAPI = frameBufferCanvasAPI

      globals = {
        console,
        StateMachine,
        JSON,
        Math,
        Object,
        Array,
        log: this.addLog,
        ...canvasAPI({
          pixels: this._pixelIntegers,
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

      // and add the key to the list of reserved tokens.
      window._script8.reservedTokens.add(key)
    })
  }

  // Writes pixel data buffer to canvas.
  writePixelDataToCanvas() {
    this._pixelData.data.set(this._pixelBytes)
    const ctx = this._canvas.getContext('2d')
    ctx.putImageData(this._pixelData, 0, 0)
  }

  // Calls window.draw(state) .
  // Works with either context or frame buffer renderer.
  drawUserGraphics(state) {
    if (window.draw) {
      window.draw(state)
      this.writePixelDataToCanvas()
    }
  }

  componentDidMount() {
    // Initialize sound API with this Tone.js volumeNode.
    this.soundFunctions = soundAPI(this.volumeNode)

    // Update globals with sound API functions.
    this.updateGlobals({
      playSong: this.soundFunctions.playSong,
      playPhrase: this.soundFunctions.playPhrase,
      stopSong: this.soundFunctions.stopSong
    })

    // Listen for mouse down / up events.
    this.mousedownHandler = () => {
      this.keys.add('mousedown')
    }
    this.mouseupHandler = () => {
      this.keys.delete('mousedown')
    }

    // Listen for key down events.
    this.keydownHandler = event => {
      // Listen for record cassette and go to previous/next screen,
      // and send them to parent.
      const { altKey, metaKey, ctrlKey, key } = event
      const { message } = this.state

      // Listen to Ctrl-s / Cmd-s.
      if (
        (!this.isEmbed &&
          (metaKey && key === 's' && _.includes(platform, 'Mac'))) ||
        (ctrlKey && key === 's' && !_.includes(platform, 'Mac'))
      ) {
        event.preventDefault()
        message.ports[0].postMessage({
          shortcut: 'save'
        })
      }

      // Listen Alt-. / Alt-/ .
      if (!this.isEmbed && altKey) {
        if (key === '.') {
          event.preventDefault()
          message.ports[0].postMessage({
            shortcut: 'previous'
          })
        }
        if (key === '/') {
          event.preventDefault()
          message.ports[0].postMessage({
            shortcut: 'next'
          })
        }
      }

      // If we pressed an allowed key, e.g. up, down, a, etc,
      if (allowedKeys.includes(key)) {
        // don't let it bubble up to the parent.
        // The inverse of this means that something like Ctrl-R (reload on windows)
        // will be indeed allowed to bubble up.
        event.preventDefault()
        event.stopPropagation()
      }

      // Finally, add the keyDown to the keys object.
      this.keys.add(key)
    }
    this.keyupHandler = event => {
      // Only handle the keys we want. Same as above.
      const { key } = event
      if (allowedKeys.includes(key)) {
        event.preventDefault()
        event.stopPropagation()
      }
      this.keys.delete(key)
    }

    // Add touch / mouse / key event handlers.
    document.addEventListener('touchstart', this.mousedownHandler)
    document.addEventListener('mousedown', this.mousedownHandler)
    document.addEventListener('touchend', this.mouseupHandler)
    document.addEventListener('mouseup', this.mouseupHandler)
    document.addEventListener('keydown', this.keydownHandler)
    document.addEventListener('keyup', this.keyupHandler)

    // Listen for `callCode`, `findInvalidToken`, or `image` messages.
    // `callCode` can come from either the parent
    // or from here, if we're in embed mode.
    // The other two will come from the parent.
    const handleData = message => {
      const { type, ...payload } = message.data
      const { blacklist, shadows } = this

      if (
        // If the message is of type callCode,
        // it means we are getting new game data (e.g. code, sprites, etc).
        type === 'callCode'
      ) {
        // Finally, set this react state with payload data,
        // and also add the message.
        this.setState({
          ...payload,
          message
        })
      } else if (
        // If we're trying to find an invalid token,
        type === 'findInvalidToken'
      ) {
        // Find the first invalid token in the provided tokens array,
        const invalidTokenIndex = payload.tokens.findIndex(
          token =>
            !validateToken({
              token,
              blacklist,
              globals: window._script8.reservedTokens,
              shadows
            })
        )
        // and if found, send to parent.
        message.ports[0].postMessage(invalidTokenIndex)
      } else if (
        // If we want an image, e.g. the parent wants a cassette screenshot,
        type === 'image'
      ) {
        // create a temporary canvas,
        const smallCanvas = document.createElement('canvas')
        // set its dimensions,
        const size = 128
        smallCanvas.width = size
        smallCanvas.height = size
        // draw onto it the pixels from the main canvas,
        smallCanvas.getContext('2d').drawImage(this._canvas, 0, 0, size, size)
        // and send the dataURL to the parent.
        message.ports[0].postMessage(smallCanvas.toDataURL())
      }
    }

    // If there's an id in the embed,
    if (window.SCRIPT_8_EMBEDDED_GIST_ID) {
      // set the isEmbed flag,
      this.isEmbed = true
      // and try fetching the gist.
      window
        .fetch(
          `${process.env.REACT_APP_NOW}/gist/${
            window.SCRIPT_8_EMBEDDED_GIST_ID
          }`
        )
        .then(response => response.json())
        .then(json => {
          // Then, parse the gist, and send data to `handleData`,
          // which starts the game.
          this.gist = json
          handleData({
            data: {
              type: 'callCode',
              game: bios,
              isDoneFetching: true,
              songs: extractGistSongs(json),
              chains: extractGistChains(json),
              phrases: extractGistPhrases(json),
              sprites: extractGistSprites(json),
              map: extractGistMap(json),
              run: true,
              callbacks: {},
              sound: true
            }
          })
        })
    } else {
      // Otherwise, wait for messages from parent.
      window.addEventListener('message', handleData)
    }

    // Finally, update globals - e.g. set `console`, `range`, the canvasAPI functions, etc
    // to the global scope for our user.
    this.updateGlobals()
  }

  componentWillUnmount() {
    document.removeEventListener('touchstart', this.mousedownHandler)
    document.removeEventListener('mousedown', this.mousedownHandler)
    document.removeEventListener('touchend', this.mouseupHandler)
    document.removeEventListener('mouseup', this.mouseupHandler)
    document.removeEventListener('keydown', this.keydownHandler)
    document.removeEventListener('keyup', this.keyupHandler)
  }

  // Call `eval` on user-supplied code.
  // TODO: for some reason all usages of this function did this:
  // evalCode({ ...state, shadows })
  evalCode() {
    const { shadows, state } = this
    // eslint-disable-next-line no-unused-vars
    const { game, message, callbacks, isDoneFetching } = state
    try {
      // If we're done fetching,
      if (isDoneFetching)
        // define the following end function, which we can only call once:
        window._script8.end = once(() => {
          // when the user calls this (which should only happen once, in bios),
          this.setState({
            // assemble the game code,
            game: assembleOrderedGame(parseGistGame(this.gist)),
            // and let us know we can show the play/pause buttons.
            started: true
          })
          // If Tone.js is not running,
          if (Tone.context.state !== 'running') {
            // start it.
            // This is allowed because the root event is a click event.
            Tone.start()
          }
          // Then, call the callback once, if we're not in embed mode
          // (if we're in embed mode, there's no parent to talk to).
          if (!this.isEmbed) {
            message.ports[0].postMessage({
              callback: callbacks.endCallback
            })
          }
        })

      // Save previous init. Why?
      // Because if it has changed, we take it the user wants to restart
      // the game. So we will run init again.
      this.previousInitString = window.init ? window.init.toString() : null

      // Get ready to eval the supplied game:

      // First, create a list of variables we want to shadow.
      const shadowString = `var ${[...shadows].join(',')}`

      // Declare a locally-scoped variable pointing to skeleton, so we can eval it.
      // eslint-disable-next-line no-unused-vars
      const innerSkeleton = skeleton

      // Eval!
      // eslint-disable-next-line no-eval
      eval(`
      // Shadow variables we don't want available.
      ${shadowString}
      // The inception eval allows the user to declare vars (e.g. screen).
      eval(innerSkeleton)
      eval(game)
    `)

      // If we got to this point, send a null error to parent.
      this.sendErrorToParent({ type: 'evalCode' })
    } catch (e) {
      // Error! Send it to parent.
      this.sendErrorToParent({ type: 'evalCode', error: e })
    }
  }

  stopTimer() {
    if (this.timer) {
      this.timer.stop()
    }
  }

  // Start the timer that calls update and draw every tick.
  startTimer() {
    // Create a function that d3.interval calls every tick.
    const timerCallback = elapsed => {
      // Wrap it in try/catch, since the reducer may throw errors.
      try {
        // Calculate the actual FPS by looking at the difference
        // between now and the last time the tick was called.
        const tickLength = elapsed - this.previousElapsed
        const fps = Math.round(1000 / tickLength)

        // Save this fps.
        this.pastFpsValues.push(fps)

        // Every 60 ticks,
        // calculate the average FPS for those 60 ticks,
        // and clear out the pastFpsValues array.
        let newFps
        if (this.pastFpsValues.length > 60) {
          newFps = Math.round(
            sum(this.pastFpsValues) / this.pastFpsValues.length
          )
          this.pastFpsValues = []
        }

        // Save current elapsed so we can use it next tick to calculate FPS.
        this.previousElapsed = elapsed

        // Get the user input (keys pressed / released, mouse down / up).
        const userInput = getUserInput(this.keys)

        // If we're running in embed mode,
        if (this.isEmbed) {
          // update the embed state.
          window.update(window._script8.embedState, userInput, tickLength)
        } else {
          // Otherwise update the redux store with the user input and tick length.
          this.store.dispatch({
            type: 'UPDATE',
            input: userInput,
            elapsed: tickLength
          })
        }

        // Draw this state.
        this.drawUserGraphics(
          this.isEmbed ? window._script8.embedState : this.store.getState()
        )
        // Clear logs after drawing.
        this.sendLogsToParent()

        // Update fps, only if we had a new measurement.
        if (newFps !== undefined && newFps !== this.state.fps) {
          this.setState({
            fps: newFps
          })
        }

        // If we got to this point, send a null error to parent.
        this.sendErrorToParent({ type: 'startTimer' })
      } catch (e) {
        // Error! Send it to parent.
        this.sendErrorToParent({ type: 'startTimer', error: e })
      }
    }
    // If the timer exists, make sure to stop it first.
    if (this.timer) {
      this.timer.stop()
    }
    // Clear out previousElapsed before we start the timer.
    this.previousElapsed = 0
    // Start the timer at our desired FPS rate.
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
    // Make init be something unique. This will force it to be reset.
    window.init = Date.now()
    // If we're embedded, setting embedState to this string will also force a reset.
    window._script8.embedState = 'SCRIPT-8-RESTART'
    this.reduxHistory = []
    this.pastFpsValues = []
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
    const { state } = this
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

    try {
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

      // If we're playing, check for two overall scenarios:
      if (!isPaused) {
        // 1 - We're embedded.
        if (this.isEmbed) {
          // Then, if the game is different,
          // or the initialState has changed,
          if (
            game !== prevState.game ||
            window._script8.embedState === 'SCRIPT-8-RESTART'
          ) {
            // evaluate user code,
            this.evalCode()
            // and run init.
            window._script8.embedState = {}
            window.init(window._script8.embedState)
          }
        } else {
          // 2 - We're not embedded.
          // Then, if we came back from being paused,
          // or the game is different,
          // or the run mode was different,
          // or init has changed,
          if (
            prevState.isPaused ||
            game !== prevState.game ||
            run !== prevState.run ||
            !equal(
              window.init ? window.init.toString() : null,
              this.previousInitString
            )
          ) {
            // evaluate user code,
            // get redux state,
            // and create redux store.

            // Evaluate user code.
            this.evalCode()

            // Before we create a redux store, let's think about what state we want.
            // If the user has changed init, use that.
            // This way we let the user start over when they modify init.
            // This is an escape hatch of sorts.
            // Otherwise use the current store state. This will enable us to modify game
            // code and not lose game state.
            if (
              !equal(
                window.init ? window.init.toString() : null,
                this.previousInitString
              )
            ) {
              // If init has changed, first create the store,
              this.store = createStore(
                this.reducer,
                {},
                applyMiddleware(this.reduxLogger)
              )
              // initialize the game,
              this.store.dispatch({
                type: 'INIT'
              })
              // and clear out the redux history.
              this.reduxHistory = []
            } else {
              // If init hasn't changed, get the store state,
              const storeState = (this.store && this.store.getState()) || {}
              // and create a new store with this state.
              this.store = createStore(
                this.reducer,
                storeState,
                applyMiddleware(this.reduxLogger)
              )
            }
          }
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
              this.evalCode()

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
                  this.updateGlobals({ log: this.addLog })
                } else {
                  this.updateGlobals({ log: NOOP })
                }
                this.store.dispatch(action)

                alteredStates.push(this.store.getState())
              })

              // Re-enable logging.
              this.updateGlobals({ log: this.addLog })

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
              this.drawUserGraphics(stateToDraw)

              // Get all unique actors.
              const allActors = flatten(
                alteredStates.map(state => state.actors)
              ).filter(d => d)
              const actors = uniqBy(allActors, d => d.id)

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
                        selectedActors.includes(d.id)
                      )) ||
                    []
                  // Disable logging during window.draw calls.
                  this.updateGlobals({ log: NOOP })
                  window.drawActors &&
                    window.drawActors({ actors: matchingActors }, true)
                  // Re-enable console.log.
                  this.updateGlobals({ log: this.addLog })
                }
              })

              // Draw the timeLineIndex one last, not faded.
              const lastAlteredState = alteredStates[newTimelineIndex]
              if (
                window.drawActors &&
                lastAlteredState &&
                lastAlteredState.actors
              ) {
                window.drawActors({
                  actors: lastAlteredState.actors.filter(d =>
                    selectedActors.includes(d.id)
                  )
                })
              }

              // Clear logs after drawing.
              this.sendLogsToParent()

              // Draw to canvas right now.
              this.writePixelDataToCanvas()

              // Finally, set the store to point to the timeLineIndex altered state,
              // so that when we hit play, we can resume right from this point.
              this.store = createStore(this.reducer, stateToDraw)

              this.setState({
                alteredStates,
                actors,
                timelineIndex: newTimelineIndex
              })
            }
            this.sendErrorToParent({ type: 'isPaused' })
          } catch (e) {
            this.sendErrorToParent({ type: 'isPaused', error: e })
          }
        } else {
          // If the ul buttons don't have any canvases, add them!
          const buttons = [...this._ul.querySelectorAll('button')]
          const canvases = [...this._ul.querySelectorAll('canvas')]

          if (buttons.length !== canvases.length) {
            actors.forEach((actor, i) => {
              // Fill the buffer with 0.
              this._pixelIntegers.fill(0)

              // Draw this actor on the center of the screen.
              window.drawActors({
                actors: [
                  {
                    ...actor,
                    x: 64,
                    y: 64
                  }
                ]
              })

              // Draw to canvas right now.
              this.writePixelDataToCanvas()

              // Get its canvas.
              const lilCanvas = trimCanvas({
                ctx: this._canvas.getContext('2d'),
                width: CANVAS_SIZE,
                height: CANVAS_SIZE
              })

              // and append to button.
              buttons[i].appendChild(lilCanvas)
            })

            this.drawUserGraphics(this.store.getState())
          }
        }
      }
      // If we got to this point, send a null error to parent.
      this.sendErrorToParent({ type: 'componentDidMount' })
    } catch (e) {
      // Error! Send it to parent.
      this.sendErrorToParent({ type: 'componentDidMount', error: e })
    }

    // If we haven't started the timer yet, do so now.
    if (!this.timer && !isPaused) {
      this.startTimer()
    }

    // If we had a message,
    if (message) {
      // send the height to parent.
      const height = document.body.querySelector('.container').scrollHeight
      if (height !== this.heightSent && !this.isEmbed) {
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
      run,
      started
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
          <div className={classNames('stats', { invisible: run && !started })}>
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
                hide: isPaused || true
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
              {actors.map((actor, i) => (
                <li
                  key={actor.id}
                  className={classNames({
                    hide: i > 6
                  })}
                >
                  <button
                    className={classNames({
                      active: selectedActors.includes(actor.id)
                    })}
                    onClick={() => this.handleActorClick(actor.id)}
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
