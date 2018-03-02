import React, { Component } from 'react'
import PropTypes from 'prop-types'
import canvasAPI from '../utils/canvasAPI/index.js'
// import _ from 'lodash'

const size = 128

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
      const rect = e.target.getBoundingClientRect()
      const { width, height } = rect
      if ('offsetX' in nativeEvent) {
        offset = [nativeEvent.offsetX, nativeEvent.offsetY]
      } else {
        offset = [e.clientX - rect.left, e.clientY - rect.top]
      }
      const [x, y] = offset

      this.api.clear()
      this.api.circFill(x * size / width, y * size / height, 10, 2)
      this.api.circStroke(x * size / width, y * size / height, 10, 0)
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
