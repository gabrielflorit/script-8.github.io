import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import classNames from 'classnames'
import actions from '../actions/actions.js'
import canvasAPI from '../iframe/src/contextCanvasAPI/index.js'
import { replaceAt } from '../utils/string.js'

const mapStateToProps = ({ sprites }) => ({ sprites })

const mapDispatchToProps = dispatch => ({
  updateSprite: ({ sprite, index }) =>
    dispatch(
      actions.updateSprite({
        sprite,
        index
      })
    )
})

class Sprite extends Component {
  constructor(props) {
    super(props)

    this.draw = this.draw.bind(this)
    this.handleTypeClick = this.handleTypeClick.bind(this)
    this.handleColorClick = this.handleColorClick.bind(this)
    this.handleCanvasClick = this.handleCanvasClick.bind(this)
    this.handleOnMouseDown = this.handleOnMouseDown.bind(this)
    this.handleOnMouseEnter = this.handleOnMouseEnter.bind(this)
    this.handleOnMouseUp = this.handleOnMouseUp.bind(this)
    this.handleOnTouchMove = this.handleOnTouchMove.bind(this)
    this.getCurrentSprite = this.getCurrentSprite.bind(this)
    this.drawPixel = this.drawPixel.bind(this)
    this.setMode = this.setMode.bind(this)

    this.state = {
      spriteIndex: 0,
      colorIndex: 0,
      mouseDown: false,
      mode: '+'
    }
  }

  draw() {
    // Assign various properties to global scope, for the user.
    const { sprites } = this.props
    this.canvasAPI = canvasAPI({
      ctx: this._canvas.getContext('2d'),
      width: 128,
      height: 64,
      sprites
    })

    this.canvasAPI.clear()
    Object.keys(sprites).forEach(skey => {
      const key = +skey
      const row = Math.floor(key / 16)
      const col = key % 16
      this.canvasAPI.sprite(col * 8, row * 8, key)
    })
  }

  componentDidMount() {
    this.draw()
  }

  getCurrentSprite() {
    const { sprites } = this.props
    const { spriteIndex } = this.state
    return _.get(sprites, spriteIndex, _.range(8).map(d => '        '))
  }

  handleCanvasClick(spriteIndex) {
    this.setState({ spriteIndex })
  }

  handleColorClick(colorIndex) {
    this.setState({ colorIndex, mode: '+' })
  }

  handleTypeClick(typeIndex) {
    const { spriteIndex } = this.state
    const { updateSprite } = this.props
    const sprite = this.getCurrentSprite()

    const newSprite = [...sprite.slice(0, 8), typeIndex]

    updateSprite({ sprite: newSprite, index: spriteIndex })
  }

  handleOnMouseDown(e) {
    this.setState({
      mouseDown: true
    })
    const { row, col } = e.target.dataset
    this.drawPixel({ row: +row, col: +col })
  }

  handleOnMouseEnter(e) {
    if (this.state.mouseDown) {
      const { row, col } = e.target.dataset
      this.drawPixel({ row: +row, col: +col })
    }
  }

  handleOnMouseUp() {
    this.setState({
      mouseDown: false
    })
  }

  handleOnTouchMove(e) {
    if (this.state.mouseDown) {
      const touchLocation = e.changedTouches[0]
      const dataset = document.elementFromPoint(
        touchLocation.clientX,
        touchLocation.clientY
      ).dataset
      const { row, col } = dataset
      if (row && col) {
        this.drawPixel({ row: +row, col: +col })
      }
    }
  }

  setMode(mode) {
    this.setState({
      mode
    })
  }

  drawPixel({ row, col }) {
    const { spriteIndex, colorIndex, mode } = this.state
    const { updateSprite } = this.props

    const sprite = this.getCurrentSprite()

    const newSprite = JSON.parse(JSON.stringify(sprite))

    // Set it to the selected color.
    newSprite[row] = replaceAt(
      newSprite[row],
      col,
      mode === '+' ? colorIndex : ' '
    )

    updateSprite({ sprite: newSprite, index: spriteIndex })
  }

  componentDidUpdate() {
    this.draw()
  }

  render() {
    const { spriteIndex, colorIndex, mode } = this.state
    const sprite = this.getCurrentSprite()
    const isEmpty = !sprite.slice(0, 8).filter(d => d !== '        ').length
    const typeIndex = sprite.length === 8 ? 0 : +sprite[8]
    return (
      <div
        onMouseUp={this.handleOnMouseUp}
        onTouchEnd={this.handleOnMouseUp}
        className="Sprite two-rows-and-grid"
      >
        <div className="main">
          <div className="SpriteEditor">
            <div className="sprite-and-colors">
              <table className="sprite">
                <tbody>
                  {_.range(8).map(row => (
                    <tr key={row}>
                      {_.range(8).map(col => {
                        const value = _.get(sprite, [row, col], ' ')
                        return (
                          <td key={col}>
                            <button
                              data-row={row}
                              data-col={col}
                              onMouseDown={this.handleOnMouseDown}
                              onMouseEnter={this.handleOnMouseEnter}
                              onTouchStart={this.handleOnMouseDown}
                              onTouchMove={this.handleOnTouchMove}
                              className={`background-${value}`}
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
              <div className="colors-and-tools">
                <table className="colors">
                  <tbody>
                    {_.range(2).map(row => (
                      <tr key={row}>
                        {_.range(0 + 4 * row, 4 + 4 * row).map(col => {
                          return (
                            <td
                              key={col}
                              className={classNames({
                                active: col === colorIndex && mode === '+'
                              })}
                            >
                              <button
                                onClick={() => this.handleColorClick(col)}
                                className={classNames(
                                  `background-${col}`,
                                  `border-${col}`,
                                  {
                                    active: col === colorIndex && mode === '+'
                                  }
                                )}
                              />
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="tools">
                  <div className="add-delete">
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
                  <table className={classNames('types', { hide: isEmpty })}>
                    <tbody>
                      <tr>
                        {_.range(4).map(i => {
                          return (
                            <td
                              key={i}
                              className={classNames({
                                active: i === typeIndex
                              })}
                            >
                              <button
                                onClick={() => this.handleTypeClick(i)}
                                className={classNames({
                                  active: i === typeIndex
                                })}
                              >
                                {i}
                              </button>
                            </td>
                          )
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="sprites">
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
                                this.handleCanvasClick(thisSpriteIndex)
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
                ref={_canvas => {
                  this._canvas = _canvas
                }}
              />
            </div>
            <div className="sprite-number">{spriteIndex}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sprite)
