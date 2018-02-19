import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as acorn from 'acorn'

class Output extends Component {
  componentDidMount () {
    setTimeout(() => {
      this.evaluate({ ...this.props })
    }, 1000)
  }

  componentDidUpdate () {
    this.evaluate({ ...this.props })
  }

  evaluate ({ game, run }) {
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
      iframe.callCode(game, run)
    }
  }

  render () {
    return (
      <div className='Output'>
        <iframe width={512} height={512} title='script-8' src='iframe.html' />
      </div>
    )
  }
}

Output.propTypes = {
  game: PropTypes.string,
  run: PropTypes.bool
}

export default Output
