import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as acorn from 'acorn'

class Output extends Component {
  constructor (props) {
    super(props)

    this.evaluate = this.evaluate.bind(this)
  }

  shouldComponentUpdate () {
    return false
  }

  componentWillReceiveProps (nextProps) {
    if (this.isLoaded) {
      if (nextProps.game !== this.props.game) {
        this.evaluate()
      }
    }
  }

  evaluate () {
    const { game, run, handleEnd } = this.props

    // Validate code before drawing.
    let isValid = true
    try {
      acorn.parse(game)
    } catch (e) {
      isValid = false
    }

    if (isValid) {
      // Get the iframe.
      const iframe = window.frames[0]

      // Send iframe the game code.
      iframe.callCode(game, run, handleEnd)
    }
  }

  render () {
    return (
      <div className='Output'>
        <iframe
          src='iframe.html'
          title='SCRIPT-8'
          ref={_iframe => {
            this._iframe = _iframe
          }}
          onLoad={() => {
            this.isLoaded = true
            this.evaluate()
          }}
        />
      </div>
    )
  }
}

Output.propTypes = {
  game: PropTypes.string,
  run: PropTypes.bool,
  handleEnd: PropTypes.func
}

export default Output
