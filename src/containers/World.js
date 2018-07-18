import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import classNames from 'classnames'
import canvasAPI from '../iframe/src/canvasAPI/index.js'
// import { replaceAt } from '../utils/string.js'
// import actions from '../actions/actions.js'

const mapStateToProps = ({ sprites, rooms }) => ({ sprites, rooms })

const mapDispatchToProps = dispatch => ({})

class World extends Component {
  constructor (props) {
    super(props)
    this.handleOnMouseDown = this.handleOnMouseDown.bind(this)
    this.handleOnMouseEnter = this.handleOnMouseEnter.bind(this)
    this.handleOnMouseUp = this.handleOnMouseUp.bind(this)
    // this.handleOnTouchMove = this.handleOnTouchMove.bind(this)
    this.handleSpriteClick = this.handleSpriteClick.bind(this)
    this.drawSprite = this.drawSprite.bind(this)
    this.draw = this.draw.bind(this)
    this.getCurrentRoom = this.getCurrentRoom.bind(this)

    this.state = {
      spriteIndex: 0,
      roomIndex: 0,
      mouseDown: false
    }
  }

  draw () {}

  componentDidMount () {
    const { sprites, rooms } = this.props
    const { roomIndex } = this.state

    this.spriteCanvasAPI = canvasAPI({
      ctx: this._spriteCanvas.getContext('2d'),
      width: 128,
      height: 64,
      sprites
    })

    this.spriteCanvasAPI.clear()
    Object.keys(sprites).forEach(skey => {
      const key = +skey
      const row = Math.floor(key / 16)
      const col = key % 16
      this.spriteCanvasAPI.sprite(col * 8, row * 8, key)
    })

    this.roomCanvasAPI = canvasAPI({
      ctx: this._roomCanvas.getContext('2d'),
      width: 128,
      height: 128,
      sprites
    })

    const room = rooms[roomIndex]
    if (room) {
      room.forEach((row, rowNumber) => {
        row.forEach((col, colNumber) => {
          this.roomCanvasAPI.sprite(colNumber * 8, rowNumber * 8, col)
        })
      })
    }
  }

  componentDidUpdate () {
    this.draw()
  }

  handleOnMouseDown (e) {
    this.setState({
      mouseDown: true
    })
    const { row, col } = e.target.dataset
    this.drawSprite({ row: +row, col: +col })
  }

  handleOnMouseEnter () {
    if (this.state.mouseDown) {
      // const { row, col } = e.target.dataset
      // this.drawPixel({ row: +row, col: +col })
    }
  }

  handleOnMouseUp () {
    this.setState({
      mouseDown: false
    })
  }

  handleSpriteClick (spriteIndex) {
    this.setState({ spriteIndex })
  }

  drawSprite ({ row, col }) {
    console.log({ row, col })
  }

  getCurrentRoom () {
    const { rooms } = this.props
    const { roomIndex } = this.state
    return _.get(
      rooms,
      roomIndex,
      _.range(16).map(d => _.range(16).map(d => null))
    )
  }

  render () {
    const { spriteIndex } = this.state
    const room = this.getCurrentRoom()
    return (
      <div
        onMouseUp={this.handleOnMouseUp}
        onTouchEnd={this.handleOnMouseUp}
        className='World two-rows-and-grid'
      >
        <div className='main'>
          <div className='WorldEditor'>
            <div className='room-and-tools'>
              <div className='room'>
                <table>
                  <tbody>
                    {_.range(16).map(row => (
                      <tr key={row}>
                        {_.range(16).map(col => {
                          const value = _.get(room, [row, col], ' ')
                          return (
                            <td key={col}>
                              <button
                                data-row={row}
                                data-col={col}
                                onMouseDown={this.handleOnMouseDown}
                                onMouseEnter={this.handleOnMouseEnter}
                                onTouchStart={this.handleOnMouseDown}
                                onTouchMove={this.handleOnTouchMove}
                                className='background-'
                              >
                                {value === ' ' ? 'x' : ''}
                              </button>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <canvas
                  width={128}
                  height={128}
                  ref={_roomCanvas => {
                    this._roomCanvas = _roomCanvas
                  }}
                />
              </div>
            </div>
            <div className='sprites'>
              <table>
                <tbody>
                  {_.range(8).map(row => (
                    <tr key={row}>
                      {_.range(16).map(col => {
                        const thisSpriteIndex = row * 16 + col
                        return (
                          <td
                            className={classNames({
                              active: spriteIndex === thisSpriteIndex
                            })}
                            key={col}
                          >
                            <button
                              onClick={() =>
                                this.handleSpriteClick(thisSpriteIndex)
                              }
                            />
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <canvas
                width={128}
                height={64}
                ref={_spriteCanvas => {
                  this._spriteCanvas = _spriteCanvas
                }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(World)
