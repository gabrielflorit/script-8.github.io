import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as acorn from 'acorn'

class Output extends Component {
  constructor (props) {
    super(props)

    this.evaluate = this.evaluate.bind(this)
  }

  componentDidUpdate () {
    this.evaluate()
  }

  evaluate () {
    const { game, run } = this.props

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
    const iframeDimension = 128 * 3
    const iframePadding = 32
    return (
      <div className='Output'>
        <iframe
          onLoad={this.evaluate}
          width={iframeDimension}
          height={iframeDimension}
          padding={iframePadding}
          title='script-8'
          src='iframe.html'
        />
      </div>
    )
  }
}

Output.propTypes = {
  game: PropTypes.string,
  run: PropTypes.bool
}

export default Output
