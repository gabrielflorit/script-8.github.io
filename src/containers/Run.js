import React, { Component } from 'react'

class Run extends Component {
  constructor (props) {
    super(props)
    this.keydownA = this.keydownA.bind(this)
    this.keyupA = this.keyupA.bind(this)
    this.keydownRight = this.keydownRight.bind(this)
    this.keyupRight = this.keyupRight.bind(this)
  }

  keydownA () {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
  }
  keyupA () {
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }))
  }

  keydownRight () {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
  }
  keyupRight () {
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }))
  }

  render () {
    return (
      <div className='Run'>
        <button
          className='button'
          onMouseDown={this.keydownA}
          onMouseUp={this.keyupA}
        >
          A
        </button>
        <button
          className='button'
          onMouseDown={this.keydownRight}
          onMouseUp={this.keyupRight}
        >
          Right
        </button>
      </div>
    )
  }
}

export default Run
