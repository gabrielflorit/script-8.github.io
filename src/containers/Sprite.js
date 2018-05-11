import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import classNames from 'classnames'
import Output from './Output.js'
import actions from '../actions/actions.js'
import TopBar from '../components/TopBar.js'
import canvasAPI from '../iframe/src/canvasAPI/index.js'
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
  constructor (props) {
    super(props)

    this.draw = this.draw.bind(this)
    this.handleColorClick = this.handleColorClick.bind(this)
    this.handleCanvasClick = this.handleCanvasClick.bind(this)
    this.handleSpriteClick = this.handleSpriteClick.bind(this)
    this.getCurrentSprite = this.getCurrentSprite.bind(this)

    this.state = {
      spriteIndex: 0,
      colorIndex: 0
    }
  }

  draw () {
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

  componentDidMount () {
    this.draw()
  }

  getCurrentSprite () {
    const { sprites } = this.props
    const { spriteIndex } = this.state
    return _.get(sprites, spriteIndex, _.range(8).map(d => '        '))
  }

  handleCanvasClick (spriteIndex) {
    this.setState({ spriteIndex })
  }

  handleColorClick (colorIndex) {
    this.setState({ colorIndex })
  }

  handleSpriteClick ({ row, col }) {
    const { spriteIndex, colorIndex } = this.state
    const { updateSprite } = this.props

    const sprite = this.getCurrentSprite()

    let newSprite = JSON.parse(JSON.stringify(sprite))

    // If we are clicking on a cell that already has the
    // currently selected color, clear it out.
    // Otherwise set it to the selected color.
    newSprite[row] = replaceAt(
      newSprite[row],
      col,
      newSprite[row][col] === colorIndex.toString() ? ' ' : colorIndex
    )

    updateSprite({ sprite: newSprite, index: spriteIndex })
  }

  componentDidUpdate () {
    this.draw()
  }

  render () {
    const { spriteIndex, colorIndex } = this.state
    const sprite = this.getCurrentSprite()
    return (
      <div className='Sprite two-rows two-rows-and-grid'>
        <TopBar />
        <div className='main'>
          <div className='SpriteEditor'>
            <div className='sprite-colors'>
              <table className='sprite'>
                <tbody>
                  {_.range(8).map(row => (
                    <tr key={row}>
                      {_.range(8).map(col => {
                        const value = _.get(sprite, [row, col], ' ')
                        return (
                          <td key={col}>
                            <button
                              onClick={() =>
                                this.handleSpriteClick({ row, col })
                              }
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
              <div className='colors'>
                <table>
                  <tbody>
                    {_.range(2).map(row => (
                      <tr key={row}>
                        {_.range(0 + 4 * row, 4 + 4 * row).map(col => {
                          return (
                            <td
                              key={col}
                              className={classNames({
                                active: col === colorIndex
                              })}
                            >
                              <button
                                onClick={() => this.handleColorClick(col)}
                                className={classNames(
                                  `background-${col}`,
                                  `border-${col}`,
                                  {
                                    active: col === colorIndex
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
                onClick={this.handleCanvasClick}
              />
            </div>
          </div>
          <Output />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sprite)
