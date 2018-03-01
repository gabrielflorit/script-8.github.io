import React, { Component } from 'react'
import { connect } from 'react-redux'
import Updater from './Updater.js'
import Title from './Title.js'
import Menu from './Menu.js'
import NavBar from './NavBar.js'

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch, props) => ({})

class Sfx extends Component {
  constructor (props) {
    super(props)

    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
  }

  handleMouseMove (e) {
    if (this.isDown) {
      const { nativeEvent } = e
      let offset
      if ('offsetX' in nativeEvent) {
        offset = [nativeEvent.offsetX, nativeEvent.offsetY]
      } else {
        const rect = e.target.getBoundingClientRect()
        offset = [e.clientX - rect.left, e.clientY - rect.top]
      }
      console.log(offset)
    }
  }

  handleMouseDown (e) {
    this.isDown = true
  }

  handleMouseUp () {
    this.isDown = false
  }

  noop () {}

  render () {
    return (
      <div
        className='Sfx'
        onMouseUp={this.handleMouseUp}
        onMouseDown={this.handleMouseDown}
      >
        <Updater />
        <Title />
        <Menu />
        <NavBar />
        <div className='temp'>
          <div
            className='pad'
            ref={_pad => {
              this._pad = _pad
            }}
            onMouseMove={this.handleMouseMove}
          />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sfx)
