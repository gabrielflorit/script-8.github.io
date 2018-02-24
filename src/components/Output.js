import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as acorn from 'acorn'

class Output extends Component {
  shouldComponentUpdate () {
    return false
  }

  componentWillReceiveProps (nextProps) {
    if (this.isLoaded) {
      const { game } = nextProps
      if (game !== this.props.game) {
        this.evaluate(nextProps)
      }
    }
  }

  evaluate ({ game, run, handleEnd }) {
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
            this.evaluate(this.props)
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
