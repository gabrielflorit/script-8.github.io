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
    this.handleTimelineLength = this.handleTimelineLength.bind(this)
    this.handleTimelineIndexChange = this.handleTimelineIndexChange.bind(this)
    this.handleBlur = this.props.focus ? this.handleBlur.bind(this) : this.noop

    this.state = {
      timeLineLength: 0,
      timeLineIndex: 0,
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
      isPlaying: !isPlaying,
      timeLineIndex: 0
    })
  }

  componentDidMount () {
    this._iframe.focus()
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.isLoaded) {
      this.evaluate(prevState)
    }
  }

  handleTimelineLength (timeLineLength) {
    this.setState({
      timeLineIndex: timeLineLength - 1,
      timeLineLength
    })
  }

  handleTimelineIndexChange (e) {
    const { value } = e.target
    this.setState({
      timeLineIndex: +value
    })
  }

  evaluate (prevState) {
    const { game, finishBoot, run, songs, chains, phrases, screen } = this.props
    const { isPlaying, timeLineIndex } = this.state

    // Get the iframe.
    const iframe = window.frames[0]

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
      const wasPaused = prevState && !prevState.isPlaying
      const timeLineLengthCallback =
        isPaused && !wasPaused ? this.handleTimelineLength : undefined
      iframe._script8.callCode({
        game,
        songs,
        chains,
        phrases,
        run,
        endCallback: finishBoot,
        timeLineLengthCallback,
        timeLineIndex,
        isPaused
      })
    } else {
      // If we had errors, print them to console.
      console.warn(errors[0].message)
    }
  }

  render () {
    const { isPlaying, timeLineLength, timeLineIndex } = this.state
    return (
      <div className='Output'>
        <div className='timeline'>
          <button
            className={classNames('play button', { active: !isPlaying })}
            onClick={this.handlePlay}
          >
            {isPlaying ? 'pause' : 'play'}
          </button>
          <input
            className={classNames({ invisible: isPlaying })}
            type='range'
            min={0}
            step={1}
            max={timeLineLength - 1}
            value={timeLineIndex}
            onChange={this.handleTimelineIndexChange}
          />
        </div>
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
