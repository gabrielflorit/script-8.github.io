import React, { Component } from 'react'
import PropTypes from 'prop-types'
import clamp from 'lodash/clamp'
import { scaleLinear } from 'd3-scale'
import equal from 'deep-equal'
import canvasAPI from '../utils/canvasAPI/index.js'

const size = 128
const cols = 16
const octaves = 3
const halfStepHeight = 2
const totalNotes = octaves * 12 + 1
const noteWidth = 7
const volumeHeight = 2
const notesVolumeMargin = 12
const notesPadding = { top: 6, bottom: 6 }
const volumePadding = { top: 6, bottom: 6 }

const x = scaleLinear()
  .domain([1, cols + 1])
  .range([0, size])

const gap = x(2) - x(1)

const noteY = scaleLinear()
  .domain([totalNotes, 0])
  .range([notesPadding.top, totalNotes * halfStepHeight + notesPadding.top])

const volumeY = scaleLinear()
  .domain([4, 1])
  .range([
    noteY.range()[1] +
      notesPadding.bottom +
      notesVolumeMargin +
      volumePadding.top,
    noteY.range()[1] +
      notesPadding.bottom +
      notesVolumeMargin +
      volumePadding.top +
      4 * volumeHeight
  ])

class NotesPad extends Component {
  constructor (props) {
    super(props)

    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.drawNotes = this.drawNotes.bind(this)
    this.drawNote = this.drawNote.bind(this)
    this.drawVolume = this.drawVolume.bind(this)
  }

  componentDidMount () {
    const width = size
    const height = width
    const ctx = this._canvas.getContext('2d')
    this.api = canvasAPI({ ctx, width, height })
    this.drawNotes(this.props.notes)
  }

  shouldComponentUpdate () {
    return false
  }

  componentWillReceiveProps (nextProps) {
    const { notes } = nextProps
    if (!equal(notes.toString(), this.props.notes)) {
      this.drawNotes(notes)
    }
  }

  drawNotes (notes) {
    this.api.clear()
    this.api.lineH(0, noteY.range()[0] - notesPadding.top, 128, 6, true)
    this.api.lineH(0, noteY.range()[1] + notesPadding.bottom, 128, 6, true)
    this.api.lineH(0, volumeY.range()[0] - volumePadding.top, 128, 6, true)
    this.api.lineH(0, volumeY.range()[1] + volumePadding.bottom, 128, 6, true)
    notes.forEach(({ note, volume }, position) => {
      this.drawNote({ note, position: position + 1 })
      this.drawVolume({ volume, position: position + 1 })
    })
  }

  drawNote ({ note, position, c }) {
    this.api.lineV(
      x(position) + gap / 2,
      noteY(note),
      noteY(0) - noteY(note) + 1,
      6
    )
    this.api.rectFill(
      x(position) + gap / 2 - noteWidth / 2 + 1,
      noteY(note) - halfStepHeight + 1,
      noteWidth,
      halfStepHeight,
      note > 0 ? 0 : 6
    )
  }

  drawVolume ({ volume, position }) {
    this.api.rectFill(
      x(position) + gap / 2 - noteWidth / 2 + 1,
      volumeY(volume),
      noteWidth,
      volumeHeight,
      4 - volume
    )
  }

  getOffset (e) {
    const { nativeEvent } = e
    const rect = e.target.getBoundingClientRect()
    const { width, height } = rect
    let offset
    if ('offsetX' in nativeEvent) {
      offset = [nativeEvent.offsetX, nativeEvent.offsetY]
    } else {
      offset = [e.clientX - rect.left, e.clientY - rect.top]
    }
    const normalizedOffset = [
      offset[0] * size / width,
      offset[1] * size / height
    ]
    return normalizedOffset
  }

  handleMouseMove (e) {
    const { notes, enabled, updateNotes, index } = this.props
    if (enabled) {
      const offset = this.getOffset(e)
      const position = x.invert(offset[0])
      const positionModulus = position % 1
      if (
        offset[1] >= noteY.range()[0] - notesPadding.top &&
        offset[1] <= noteY.range()[1] + notesPadding.bottom &&
        positionModulus > 0.15 &&
        positionModulus < 0.85
      ) {
        const note = clamp(Math.ceil(noteY.invert(offset[1])), 0, 37)
        const noteIndex = Math.floor(position) - 1

        const newNotes = [
          ...notes.slice(0, noteIndex),
          {
            ...notes[noteIndex],
            note
          },
          ...notes.slice(noteIndex + 1)
        ]
        updateNotes({ notes: newNotes, index })
      }

      if (
        offset[1] >= volumeY.range()[0] - volumePadding.top &&
        offset[1] <= volumeY.range()[1] + volumePadding.bottom &&
        positionModulus > 0.15 &&
        positionModulus < 0.85
      ) {
        const volume = clamp(Math.ceil(volumeY.invert(offset[1])), 1, 4)
        const noteIndex = Math.floor(position) - 1

        const newNotes = [
          ...notes.slice(0, noteIndex),
          {
            ...notes[noteIndex],
            volume
          },
          ...notes.slice(noteIndex + 1)
        ]
        updateNotes({ notes: newNotes, index })
      }
    }
  }

  render () {
    return (
      <canvas
        className='NotesPad'
        width={size}
        height={size}
        ref={_canvas => {
          this._canvas = _canvas
        }}
        onMouseMove={this.handleMouseMove}
      />
    )
  }
}

NotesPad.propTypes = {
  enabled: PropTypes.bool.isRequired,
  updateNotes: PropTypes.func.isRequired,
  notes: PropTypes.array,
  index: PropTypes.number.isRequired
}

NotesPad.cols = cols

export default NotesPad
