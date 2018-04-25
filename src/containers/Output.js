import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../actions/actions.js'
import bios from '../utils/bios.js'
import screenTypes from '../utils/screenTypes.js'
import { getLintErrors } from '../utils/setupLinter.js'

const mapStateToProps = ({ screen, game, songs, chains, phrases }) => ({
  songs,
  chains,
  phrases,
  game: screen === screenTypes.BOOT ? bios : game,
  focus: screen === screenTypes.RUN,
  run: [screenTypes.BOOT, screenTypes.RUN].includes(screen),
  screen
})

const mapDispatchToProps = dispatch => ({
  finishBoot: () => dispatch(actions.finishBoot())
})

class Output extends Component {
  constructor (props) {
    super(props)

    this.evaluate = this.evaluate.bind(this)
    this.handleBlur = this.props.focus ? this.handleBlur.bind(this) : this.noop
  }

  noop () {}

  handleBlur (e) {
    e.currentTarget.focus()
  }

  componentDidMount () {
    this._iframe.focus()
  }

  componentDidUpdate (prevProps) {
    if (this.isLoaded) {
      this.evaluate()
    }
  }

  evaluate () {
    const { game, finishBoot, run, songs, chains, phrases, screen } = this.props

    // Create a closured function for eval'ing the game.
    const sendPayload = (callbacks = {}) => {
      const channel = new window.MessageChannel()
      this._iframe.contentWindow.postMessage(
        {
          type: 'callCode',
          game,
          songs,
          chains,
          phrases,
          run,
          callbacks
        },
        '*',
        [channel.port2]
      )
      channel.port1.onmessage = e => {
        if (e.data.callback === 'finishBoot') {
          finishBoot()
        }
        const { height } = e.data
        if (height) {
          this._iframe.height = height
        }
      }
    }

    // If we're on the boot screen,
    // ignore validation.
    if (screen === screenTypes.BOOT) {
      sendPayload({
        endCallback: 'finishBoot'
      })
    } else {
      // Validate code before drawing.
      getLintErrors({ text: game }).then(errors => {
        if (!errors.length) {
          sendPayload()
        } else {
          // If we had errors, print them to console.
          console.warn(errors[0].message)
        }
      })
    }
  }

  render () {
    return (
      <div className='Output'>
        <iframe
          src='http://localhost:3001'
          title='SCRIPT-8'
          sandbox='allow-scripts allow-same-origin'
          onBlur={this.handleBlur}
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

export default connect(mapStateToProps, mapDispatchToProps)(Output)
