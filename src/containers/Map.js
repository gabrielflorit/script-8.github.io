import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import classNames from 'classnames'
import canvasAPI from '../iframe/src/contextCanvasAPI/index.js'
import actions from '../actions/actions.js'

const mapStateToProps = ({ sprites, map }) => ({ sprites, map })

const mapDispatchToProps = dispatch => ({
  updateMap: newMap => dispatch(actions.updateMap(newMap))
})

class Map extends Component {
  constructor (props) {
    super(props)
    this.handleOnMouseDown = this.handleOnMouseDown.bind(this)
    this.handleOnMouseEnter = this.handleOnMouseEnter.bind(this)
    this.handleOnMouseUp = this.handleOnMouseUp.bind(this)
    this.handleOnTouchMove = this.handleOnTouchMove.bind(this)
    this.handleSpriteClick = this.handleSpriteClick.bind(this)
    this.handleRoomClick = this.handleRoomClick.bind(this)
    this.drawSprite = this.drawSprite.bind(this)
    this.drawRoom = this.drawRoom.bind(this)
    this.drawMap = this.drawMap.bind(this)
    this.getCurrentRoom = this.getCurrentRoom.bind(this)
    this.setMode = this.setMode.bind(this)

    this.state = {
      spriteIndex: 0,
      roomIndex: 0,
      mouseDown: false,
      mode: '+'
    }
  }

  componentDidMount () {
    this.drawSprites()
    this.drawRoom()
    this.drawMap()
  }

  drawSprites () {
    const { sprites } = this.props

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
  }

  drawRoom () {
    const before = Date.now()

    const { sprites, map } = this.props
    const { roomIndex } = this.state

    this.roomCanvasAPI = canvasAPI({
      ctx: this._roomCanvas.getContext('2d'),
      width: 128,
      height: 128,
      sprites
    })

    this.roomCanvasAPI.clear()
    _.range(16).forEach(rowN => {
      _.range(16).forEach(colN => {
        const sprite = _.get(map, [
          Math.floor(roomIndex / 8) * 16 + rowN,
          (roomIndex % 8) * 16 + colN
        ])
        this.roomCanvasAPI.sprite(colN * 8, rowN * 8, sprite)
      })
    })

    const after = Date.now()
    console.log(`this.drawRoom() took: ${after - before}ms`)
  }

  drawMap () {
    const before = Date.now()

    const { map, sprites } = this.props
    this.mapCanvasAPI = canvasAPI({
      ctx: this._mapCanvas.getContext('2d'),
      width: 128 * 8,
      height: 128 * 4,
      sprites,
      map
    })

    this.mapCanvasAPI.clear()
    map.forEach((row, rowNumber) => {
      row.forEach((col, colNumber) => {
        this.mapCanvasAPI.sprite(colNumber * 8, rowNumber * 8, col)
      })
    })

    const after = Date.now()
    console.log(`this.drawMap() took: ${after - before}ms`)
  }

  componentDidUpdate () {
    this.drawRoom()
    this.drawMap()
  }

  handleOnMouseDown (e) {
    this.setState({
      mouseDown: true
    })
    const { row, col } = e.target.dataset
    this.drawSprite({ row: +row, col: +col })
  }

  handleOnMouseEnter (e) {
    if (this.state.mouseDown) {
      const { row, col } = e.target.dataset
      this.drawSprite({ row: +row, col: +col })
    }
  }

  handleOnMouseUp () {
    this.setState({
      mouseDown: false
    })
  }

  handleOnTouchMove (e) {
    if (this.state.mouseDown) {
      const touchLocation = e.changedTouches[0]
      const dataset = document.elementFromPoint(
        touchLocation.clientX,
        touchLocation.clientY
      ).dataset
      const { row, col } = dataset
      if (row && col) {
        this.drawSprite({ row: +row, col: +col })
      }
    }
  }

  handleSpriteClick (spriteIndex) {
    this.setState({ spriteIndex, mode: '+' })
  }

  handleRoomClick (roomIndex) {
    this.setState({ roomIndex })
  }

  drawSprite ({ row, col }) {
    const { roomIndex, spriteIndex, mode } = this.state
    const { updateMap } = this.props
    const map = this.getCurrentRoom()
    const newMap = JSON.parse(JSON.stringify(map))
    newMap[Math.floor(roomIndex / 8) * 16 + row][(roomIndex % 8) * 16 + col] =
      mode === '+' ? spriteIndex : null
    updateMap(newMap)
  }

  getCurrentRoom () {
    const { map } = this.props
    return map.length ? map : Map.createBlankMap()
  }

  setMode (mode) {
    this.setState({
      mode
    })
  }

  render () {
    const { roomIndex, spriteIndex, mode } = this.state
    const { map } = this.props
    return (
      <div
        onMouseUp={this.handleOnMouseUp}
        onTouchEnd={this.handleOnMouseUp}
        className='Map two-rows-and-grid'
      >
        <div className='main'>
          <div className='MapEditor'>
            <div className='room-and-tools'>
              <div className='room'>
                <table>
                  <tbody>
                    {_.range(16).map(row => (
                      <tr key={row}>
                        {_.range(16).map(col => {
                          const sprite = _.get(map, [
                            Math.floor(roomIndex / 8) * 16 + row,
                            (roomIndex % 8) * 16 + col
                          ])
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
                                {_.isNil(sprite) ? 'x' : ''}
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
              <div className='tools'>
                <button
                  className={classNames('button', {
                    active: mode === '+'
                  })}
                  onClick={() => {
                    this.setMode('+')
                  }}
                >
                  +
                </button>

                <button
                  className={classNames('button', {
                    active: mode === '-'
                  })}
                  onClick={() => {
                    this.setMode('-')
                  }}
                >
                  -
                </button>
              </div>
            </div>
            <div className='sprites-and-map'>
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
                                active:
                                  spriteIndex === thisSpriteIndex &&
                                  mode === '+'
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
              <div className='map'>
                <table>
                  <tbody>
                    {_.range(4).map(row => (
                      <tr key={row}>
                        {_.range(8).map(col => {
                          const thisRoomIndex = row * 8 + col
                          return (
                            <td
                              className={classNames({
                                active: roomIndex === thisRoomIndex
                              })}
                              key={col}
                            >
                              <button
                                onClick={() =>
                                  this.handleRoomClick(thisRoomIndex)
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
                  width={128 * 8}
                  height={128 * 4}
                  ref={_mapCanvas => {
                    this._mapCanvas = _mapCanvas
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Map.createBlankMap = () => _.range(64).map(() => _.range(128).map(() => null))

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map)
