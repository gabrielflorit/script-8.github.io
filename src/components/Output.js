import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as acorn from 'acorn'
import canvasAPI from '../utils/canvasAPI.js'

class Output extends Component {
  componentDidMount () {
    // Setup the canvas dimensions.
    this.size = 128
    this._canvas.style.width = this.size * 4 + 'px'
    this._canvas.style.height = this.size * 4 + 'px'
    this._canvas.width = this.size
    this._canvas.height = this.size
    this.ctx = this._canvas.getContext('2d')

    // Setup the canvas api.
    this.canvasAPI = canvasAPI({ ctx: this.ctx, size: this.size })

    this.draw(this.props.game)
  }

  componentDidUpdate () {
    const { game } = this.props
    this.draw(game)
  }

  draw (game) {
    // Validate code before drawing.
    let isValid = true
    try {
      acorn.parse(game)
    } catch (e) {
      isValid = false
    }

    // Get the canvas API functions for the game code.
    // eslint-disable-next-line no-unused-vars
    const { strokeRect, fillRect, strokeCirc, fillCirc, clear } = this.canvasAPI

    if (isValid) {
      try {
        // eslint-disable-next-line no-eval
        eval(game + '; update && update(); draw && draw(); ')
      } catch (e) {
        console.error(e.message)
      }
    }
  }

  render () {
    return (
      <div className='Output'>
        <canvas
          ref={_canvas => {
            this._canvas = _canvas
          }}
        />
      </div>
    )
  }
}

Output.propTypes = {
  game: PropTypes.string
}

export default Output
