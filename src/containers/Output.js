import React, { Component } from 'react'
import * as acorn from 'acorn'
import { connect } from 'react-redux'
import actions from '../actions/actions.js'
import bios from '../utils/bios.js'
import screenTypes from '../utils/screenTypes.js'

const mapStateToProps = ({ game, screen }) => ({
  game,
  screen
})

const mapDispatchToProps = (dispatch, props) => ({
  finishBoot: () => dispatch(actions.finishBoot())
})

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

  evaluate ({ game, finishBoot, screen }) {
    const thegame = screen === screenTypes.BOOT ? bios : game
    const run = screen === screenTypes.BOOT || screen === screenTypes.RUN
    // Validate code before drawing.
    let isValid = true
    try {
      acorn.parse(thegame)
    } catch (e) {
      isValid = false
    }

    if (isValid) {
      // Get the iframe.
      const iframe = window.frames[0]

      // Send iframe the game code.
      iframe.callCode(thegame, run, finishBoot)
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

export default connect(mapStateToProps, mapDispatchToProps)(Output)
