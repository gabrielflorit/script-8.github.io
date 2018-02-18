import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as acorn from 'acorn'

class Output extends Component {
  shouldComponentUpdate ({ game }) {
    // Get the iframe.
    const iframe = window.frames[0]

    // Validate code before sending.
    let isValid = true
    try {
      acorn.parse(game)
    } catch (e) {
      isValid = false
    }

    if (isValid) {
      iframe.gametron.callCode(game)
    }

    return false
  }

  render () {
    return (
      <div className='Output'>
        <iframe title='gam-8' src='iframe.html' />
      </div>
    )
  }
}

Output.propTypes = {
  game: PropTypes.string
}

export default Output
