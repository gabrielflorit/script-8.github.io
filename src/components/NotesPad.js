import React, { Component } from 'react'
import PropTypes from 'prop-types'
import canvasAPI from '../utils/canvasAPI/index.js'

const size = 200

class NotesPad extends Component {
  constructor (props) {
    super(props)

    this.handleMouseMove = this.handleMouseMove.bind(this)
  }

  componentDidMount () {
    const width = size
    const height = width
    const ctx = this._canvas.getContext('2d')
    this.api = canvasAPI({ ctx, width, height })
  }

  handleMouseMove (e) {
    if (this.props.enabled) {
      const { nativeEvent } = e
      let offset
      if ('offsetX' in nativeEvent) {
        offset = [nativeEvent.offsetX, nativeEvent.offsetY]
      } else {
        const rect = e.target.getBoundingClientRect()
        offset = [e.clientX - rect.left, e.clientY - rect.top]
      }
      this.api.clear()
      this.api.circFill(offset[0] / 2, offset[1] / 2, 5, 1)
      this.api.circStroke(offset[0] / 2, offset[1] / 2, 10, 0)
    }
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
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
  enabled: PropTypes.bool.isRequired
}

export default NotesPad
