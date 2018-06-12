import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../actions/actions.js'
import bios from '../utils/bios.js'
import screenTypes from '../utils/screenTypes.js'
import isBlank from '../utils/isBlank.js'
import { getLintErrors } from '../utils/setupLinter.js'

const mapStateToProps = ({
  screen,
  game,
  songs,
  chains,
  phrases,
  sprites,
  sound,
  gist
}) => ({
  songs,
  chains,
  phrases,
  sprites,
  game: screen === screenTypes.BOOT ? bios : game,
  focus: screen === screenTypes.RUN,
  run: [screenTypes.BOOT, screenTypes.RUN].includes(screen),
  screen,
  sound,
  gist
})

const mapDispatchToProps = dispatch => ({
  finishBoot: () => dispatch(actions.finishBoot())
})

class Output extends Component {
  constructor (props) {
    super(props)

    this.evaluate = this.evaluate.bind(this)
    this.resize = _.debounce(this.resize.bind(this), 100)
    this.handleBlur = this.props.focus ? this.handleBlur.bind(this) : this.noop

    window.addEventListener('resize', this.resize)
  }

  noop () {}

  resize () {
    if (this.isLoaded) {
      this.evaluate()
    }
  }

  handleBlur (e) {
    e.currentTarget.focus()
  }

  componentDidMount () {
    this._iframe.focus()
  }

  componentDidUpdate () {
    if (this.isLoaded) {
      this.evaluate()
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize)
  }

  evaluate () {
    const {
      game,
      finishBoot,
      run,
      songs,
      chains,
      phrases,
      sprites,
      screen,
      sound,
      gist
    } = this.props

    // Create a closured function for eval'ing the game.
    const sendPayload = (callbacks = {}) => {
      const channel = new window.MessageChannel()
      if (this._iframe) {
        const blank = isBlank({ game, sprites, phrases, chains, songs })
        const gistIsEmpty = _.isEmpty(gist)
        this._iframe.contentWindow.postMessage(
          {
            type: 'callCode',
            game,
            songs,
            chains,
            phrases,
            sprites,
            run,
            callbacks,
            sound,
            isNew: blank && gistIsEmpty
          },
          '*',
          [channel.port2]
        )
        channel.port1.onmessage = e => {
          if (e.data.callback === 'finishBoot') {
            finishBoot()
          }
          const { height } = e.data
          if (height && this._iframe) {
            this._iframe.height = height
          }
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
          src={process.env.REACT_APP_IFRAME_URL}
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
