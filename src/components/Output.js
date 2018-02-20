import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as acorn from 'acorn'
import { interval } from 'd3-timer'
import canvasAPI from '../utils/canvasAPI.js'

class Output extends Component {
  constructor (props) {
    super(props)

    this.evaluate = this.evaluate.bind(this)
  }

  componentDidMount() {
    const size = 128
    const cssSize = size * 3
    this._canvas.style.width = `${cssSize}px`
    this._canvas.style.height = `${cssSize}px`
    this._canvas.width = size
    this._canvas.height = size

    this.ctx = this._canvas.getContext('2d')

    // Setup canvas API functions.
    const { rectStroke, rectFill, circStroke, circFill, clear } = canvasAPI({
      ctx: this.ctx,
      size
    })

    // Export them to global scope for eval's use later.
    window.clear = clear
    window.rectStroke = rectStroke
    window.rectFill = rectFill
    window.circStroke = circStroke
    window.circFill = circFill

    this.evaluate()
  }

  componentDidUpdate () {
    this.evaluate()
  }

  evaluate () {
    const { game, run } = this.props

    // Validate code before drawing.
    let isValid = true
    try {
      acorn.parse(game)
    } catch (e) {
      isValid = false
    }

    if (isValid) {
      // Force eval to run in global mode.
      // eslint-disable-next-line no-eval
      const geval = eval

      try {
        geval(game + ';')
        if (this.timer) this.timer.stop()
        this.timer = interval(() => {
          try {
            geval('update && update(); draw && draw();')
            if (!run) this.timer.stop()
          } catch (e) {
            console.error(e.message)
          }
        }, 1000 / 30)
      } catch (e) {
        console.error(e.message)
      }
    }
  }

  componentWillUnmount() {
    if (this.timer) this.timer.stop()
  }

  render () {
    return (
      <div className='Output'>
        <canvas
          ref={_canvas => {
            this._canvas = _canvas
          }} />
      </div>
    )
  }
}

Output.propTypes = {
  game: PropTypes.string,
  run: PropTypes.bool
}

export default Output
