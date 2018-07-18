import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import classNames from 'classnames'
import canvasAPI from '../iframe/src/canvasAPI/index.js'
// import { replaceAt } from '../utils/string.js'
// import actions from '../actions/actions.js'

const mapStateToProps = ({ sprites }) => ({ sprites })

const mapDispatchToProps = dispatch => ({})

class World extends Component {
  constructor (props) {
    super(props)
    this.handleOnMouseUp = this.handleOnMouseUp.bind(this)
    this.handleSpriteClick = this.handleSpriteClick.bind(this)
    this.draw = this.draw.bind(this)

    this.state = {
      spriteIndex: 0,
      mouseDown: false
    }
  }

  draw () {}

  componentDidMount () {
    const { sprites } = this.props
    this.canvasAPI = canvasAPI({
      ctx: this._spriteCanvas.getContext('2d'),
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

  componentDidUpdate () {
    this.draw()
  }

  handleOnMouseUp () {
    this.setState({
      mouseDown: false
    })
  }

  handleSpriteClick (spriteIndex) {
    this.setState({ spriteIndex })
  }

  render () {
    const { spriteIndex } = this.state
    return (
      <div
        onMouseUp={this.handleOnMouseUp}
        onTouchEnd={this.handleOnMouseUp}
        className='World two-rows-and-grid'
      >
        <div className='main'>
          <div className='WorldEditor'>
            <div className='room-and-tools'>
              <table className='room'>
                <tbody>
                  {_.range(16).map(row => (
                    <tr key={row}>
                      {_.range(16).map(col => {
                        const value = ' '
                        return (
                          <td key={col}>
                            <button
                              data-row={row}
                              data-col={col}
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
