import React, { Component } from 'react'
import PropTypes from 'prop-types'
import canvasAPI from '../utils/canvasAPI/index.js'
import _ from 'lodash'

const size = 128

class NotesPad extends Component {
  constructor (props) {
    super(props)

    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.drawBars = this.drawBars.bind(this)
    this.drawBar = this.drawBar.bind(this)
  }

  componentDidMount () {
    const width = size
    const height = width
    const ctx = this._canvas.getContext('2d')
    this.api = canvasAPI({ ctx, width, height })
    this.drawBars()
  }

  shouldComponentUpdate () {
    return false
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.bars.toString() === this.props.bars.toString()) {
      this.drawBars()
    }
  }

  drawBar (x, y) {
    const d = 16
    _.range(y).forEach(i => {
      this.api.rectFill(
        (x - 1) * d,
        (8 - (i + 1)) * d,
        d,
        d,
        Math.min(y - i - 1, 6)
      )
    })
  }

  drawBars () {
    this.api.clear()
    this.props.bars.forEach((y, x) => {
      this.drawBar(x + 1, y)
    })
  }

  handleMouseMove (e) {
    if (this.props.enabled) {
      const { nativeEvent } = e
      let offset
      const rect = e.target.getBoundingClientRect()
      const { width, height } = rect
      if ('offsetX' in nativeEvent) {
        offset = [nativeEvent.offsetX, nativeEvent.offsetY]
      } else {
        offset = [e.clientX - rect.left, e.clientY - rect.top]
      }
      const normalizedOffset = [
        offset[0] * size / width,
        offset[1] * size / height
      ]
      const positions = [
        Math.ceil(normalizedOffset[0] / 16),
        9 - Math.ceil(normalizedOffset[1] / 16)
      ]
      const bars = this.props.bars
      bars[positions[0] - 1] = positions[1]
      this.props.updateBars(bars)
    }
  }

  render () {
    console.log(Date.now())
    return (
      <canvas
        width={size}
        height={size}
        ref={_canvas => {
          this._canvas = _canvas
        }}
        onMouseMove={this.handleMouseMove}
        className='NotesPad'
      />
    )
  }
}

NotesPad.propTypes = {
  enabled: PropTypes.bool.isRequired,
  updateBars: PropTypes.func.isRequired,
  bars: PropTypes.array.isRequired
}

export default NotesPad
