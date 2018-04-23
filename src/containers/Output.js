import React, { Component } from 'react'
import classNames from 'classnames'
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

    this.handlePlay = this.handlePlay.bind(this)
    this.evaluate = this.evaluate.bind(this)
    this.handleBlur = this.props.focus ? this.handleBlur.bind(this) : this.noop

    this.state = {
      isPlaying: true
    }
  }

  noop () {}

  handleBlur (e) {
    e.currentTarget.focus()
  }

  handlePlay () {
    const { isPlaying } = this.state
    this.setState({
      isPlaying: !isPlaying
    })
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
    const { isPlaying } = this.state

    // Get the iframe.
    const iframe = window.frames[0]

    // Set iframe height.
    this._iframe.height = this._iframe.contentWindow.document.body.querySelector(
      '.container'
    ).scrollHeight

    // Validate code before drawing:

    // get the iframe's validateToken function,
    const validateToken =
      screen === screenTypes.BOOT ? () => true : iframe.__script8.validateToken

    // and use it to get any linting errors.
    const errors = getLintErrors({ text: game, validateToken })

    // No errors = we're good!
    const isValid = !errors.length

    if (isValid) {
      // Send iframe the game code.
      const isPaused = !isPlaying
      iframe._script8.callCode({
        game,
        songs,
        chains,
        phrases,
        run,
        endCallback: finishBoot,
        isPaused
      })
    } else {
      // If we had errors, print them to console.
      console.warn(errors[0].message)
    }
  }

  render () {
    const { isPlaying } = this.state
    return (
      <div className='Output'>
        <button
          className={classNames('play button', { active: !isPlaying })}
          onClick={this.handlePlay}
        >
          {isPlaying ? 'pause' : 'play'}
        </button>
        <iframe
          src='iframe.html'
          sandbox='allow-scripts allow-same-origin'
          title='SCRIPT-8'
          onBlur={this.handleBlur}
          ref={_iframe => {
            this._iframe = _iframe
          }}
          onLoad={() => {
            this.isLoaded = true
            this.evaluate()
          }}
        />
        <div className='stats'>stats</div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Output)
