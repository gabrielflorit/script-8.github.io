import React, { Component } from 'react'
import PropTypes from 'prop-types'
import clamp from 'lodash/clamp'
import range from 'lodash/range'
import { scaleLinear } from 'd3-scale'
import equal from 'deep-equal'
import canvasAPI from '../utils/canvasAPI/index.js'

const cols = 16
const width = 16 * cols
const halfStepHeight = 2
const blockWidth = 15
const blocksPadding = { top: 6, bottom: 6 }

const x = scaleLinear()
  .domain([1, cols + 1])
  .range([0, width])

const gap = x(2) - x(1)

class Pad extends Component {
  constructor (props) {
    super(props)

    const { totalBlocks } = this.props

    this.height =
      blocksPadding.top + blocksPadding.bottom + totalBlocks * halfStepHeight
    this.y = scaleLinear()
      .domain([totalBlocks, 0])
      .range([
        blocksPadding.top,
        totalBlocks * halfStepHeight + blocksPadding.top
      ])

    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.drawBlocks = this.drawBlocks.bind(this)
    this.drawBlock = this.drawBlock.bind(this)
    this.getColor = this.getColor.bind(this)
  }

  componentDidMount () {
    const ctx = this._canvas.getContext('2d')
    this.api = canvasAPI({ ctx, width, height: this.height })

    const { blocks } = this.props

    this.drawBlocks(blocks)
  }

  shouldComponentUpdate () {
    return false
  }

  componentWillReceiveProps (nextProps) {
    const { blocks } = nextProps
    if (!equal(blocks.toString(), this.props.blocks)) {
      this.drawBlocks(blocks)
    }
  }

  drawBlocks (blocks) {
    this.api.clear()
    range(1, 5).forEach(i => {
      this.api.lineH(0, this.y(12 * i), width, 6, true)
    })
    blocks.forEach((block, position) => {
      this.drawBlock({ block, position: position + 1 })
    })
  }

  drawBlock ({ block, position, c }) {
    if (this.props.drawLines) {
      this.api.lineV(
        x(position) + gap / 2,
        this.y(block),
        this.y(0) - this.y(block) + 1,
        6
      )
    }
    this.api.rectFill(
      x(position) + gap / 2 - blockWidth / 2 + 1,
      this.y(block) - halfStepHeight + 1,
      blockWidth,
      halfStepHeight,
      this.getColor(block)
    )
  }

  getColor (block) {
    const { colorFormatter } = this.props
    return colorFormatter ? colorFormatter(block) : 0
  }

  getOffset (e) {
    const { nativeEvent } = e
    const rect = e.target.getBoundingClientRect()
    let offset
    if ('offsetX' in nativeEvent) {
      offset = [nativeEvent.offsetX, nativeEvent.offsetY]
    } else {
      offset = [e.clientX - rect.left, e.clientY - rect.top]
    }
    const normalizedOffset = [
      offset[0] * width / rect.width,
      offset[1] * this.height / rect.height
    ]
    return normalizedOffset
  }

  handleBlockEvent (e, isWide) {
    const { blocks, updateBlock } = this.props
    const offset = this.getOffset(e)
    const position = x.invert(offset[0])
    const positionModulus = position % 1
    if (
      offset[1] >= this.y.range()[0] - blocksPadding.top &&
      offset[1] <= this.y.range()[1] + blocksPadding.bottom &&
      positionModulus > (isWide ? 0 : 0.15) &&
      positionModulus < (isWide ? 1 : 0.85)
    ) {
      const block = clamp(
        Math.ceil(this.y.invert(offset[1])),
        this.y.domain()[1],
        this.y.domain()[0]
      )
      const blockIndex = Math.floor(position) - 1

      if (blocks[blockIndex] !== block) {
        updateBlock({ block, blockIndex })
      }
    }
  }

  handleMouseDown (e) {
    this.handleBlockEvent(e, true)
  }

  handleMouseMove (e) {
    if (this.props.enabled) {
      this.handleBlockEvent(e)
    }
  }

  render () {
    return (
      <canvas
        className='NotesPad'
        width={width}
        height={this.height}
        style={{ height: this.height * 3 }}
        ref={_canvas => {
          this._canvas = _canvas
        }}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
      />
    )
  }
}

Pad.propTypes = {
  drawLines: PropTypes.bool,
  enabled: PropTypes.bool.isRequired,
  updateBlock: PropTypes.func.isRequired,
  colorFormatter: PropTypes.func,
  getColor: PropTypes.func,
  blocks: PropTypes.array.isRequired,
  totalBlocks: PropTypes.number.isRequired
}

export default Pad
