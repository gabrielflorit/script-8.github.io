import React, { Component } from 'react'
import range from 'lodash/range'
import flatten from 'lodash/flatten'
import random from 'lodash/random'
import canvasAPI from './canvasAPI/index.js'
import validateToken from './validateToken.js'
import callCode from './callCode.js'
import './css/Iframe.css'

window.script8 = {}
window._script8 = {}

class Iframe extends Component {
  constructor (props) {
    super(props)
    this._shadows = new Set(['document'])
    this._blacklist = new Set(['eval', 'alert', '_script8', '__script8'])
    this._canvasSize = 128
  }

  componentDidMount () {
    // Assign various properties to global scope, for the user.
    const globals = {
      ...canvasAPI({
        ctx: this._canvas.getContext('2d'),
        width: this._canvasSize,
        height: this._canvasSize
      }),
      range,
      flatten,
      random
    }

    // Assign all the globals to window.
    Object.keys(globals).forEach(key => (window[key] = globals[key]))

    // Listen for callCode or validateToken parent messages.
    window.addEventListener('message', message => {
      const { type, ...payload } = message.data

      // Run user code.
      if (type === 'callCode') {
        callCode({ ...payload, shadows: this._shadows, message })
      }

      // Find the first invalid token in the provided tokens array.
      if (type === 'findInvalidToken') {
        const invalidTokenIndex = payload.tokens.findIndex(
          token =>
            !validateToken({
              token,
              blacklist: this._blacklist,
              globals,
              shadows: this._shadows
            })
        )
        message.ports[0].postMessage(invalidTokenIndex)
      }
    })
  }

  componentDidUpdate (prevProps) {
    // callCode({ game: this.state.game, shadows: this._shadows })
  }

  render () {
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
        </div>
      </div>
    )
  }
}

export default Iframe
