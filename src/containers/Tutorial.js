import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import actions from '../actions/actions.js'
import screenTypes from '../utils/screenTypes.js'
import tutorial0 from '../utils/tutorial/0.js'
import tutorial1 from '../utils/tutorial/1.js'
import tutorial2 from '../utils/tutorial/2.js'
import tutorial3 from '../utils/tutorial/3.js'
import tutorial4 from '../utils/tutorial/4.js'

// TUTORIAL data is:
// - this file
// - the tutorial reducer

const mapStateToProps = ({ tutorial, screen }) => ({
  tutorial,
  screen
})

const mapDispatchToProps = dispatch => ({
  setScreen: screen => dispatch(actions.setScreen(screen)),
  closeTutorial: () => dispatch(actions.closeTutorial()),
  newGame: screen => dispatch(actions.newGame(screen)),
  updateGame: game => dispatch(actions.updateGame(game)),
  setTutorialSlide: slide => dispatch(actions.setTutorialSlide(slide))
})

let timer

class Tutorial extends Component {
  constructor (props) {
    super(props)
    this.handleClose = this.handleClose.bind(this)
    this.handleNextSlide = this.handleNextSlide.bind(this)
    this.handlePreviousSlide = this.handlePreviousSlide.bind(this)
    this.handleSlide = this.handleSlide.bind(this)
    this.fireActions = this.fireActions.bind(this)
  }

  handleClose () {
    this.props.closeTutorial()
  }

  fireActions (slide) {
    const { setScreen, updateGame } = this.props
    const actions = {
      2: [screenTypes.CODE],
      3: [screenTypes.CODE],
      4: [screenTypes.CODE],
      5: [screenTypes.CODE, tutorial0],
      6: [screenTypes.CODE, tutorial1],
      7: [screenTypes.CODE, tutorial2],
      8: [screenTypes.CODE, tutorial3],
      9: [screenTypes.CODE, tutorial4]
    }[slide]

    if (actions) {
      setScreen(actions[0])
      if (actions[1]) {
        updateGame(`SCRIPT-8 TUTORIAL${actions[1]}`)
      }
    }
  }

  handleSlide (slide) {
    this.props.setTutorialSlide(slide)
    this.fireActions(slide)
  }

  handleNextSlide () {
    this.handleSlide(this.props.tutorial + 1)
  }

  handlePreviousSlide () {
    this.handleSlide(this.props.tutorial - 1)
  }

  componentWillUnmount () {
    timer && timer.stop()
  }

  render () {
    const { tutorial } = this.props

    const previous = (
      <button className='button' onClick={this.handlePreviousSlide}>
        previous
      </button>
    )

    const next = (
      <button className='button' onClick={this.handleNextSlide}>
        next
      </button>
    )

    const close = (
      <button className='button' onClick={this.handleClose}>
        close
      </button>
    )

    let buttons
    if (tutorial === 0 || tutorial === 1) {
      buttons = (
        <div className='buttons'>
          {next}
          {close}
        </div>
      )
    } else if (tutorial === 2) {
      buttons = (
        <div className='buttons'>
          {previous}
          {close}
        </div>
      )
    } else {
      buttons = (
        <div className='buttons'>
          >
          {previous}
          {next}
          {close}
        </div>
      )
    }

    const slides = [
      ['?NEW_USER', 'Load tutorial:'],

      [
        'SCRIPT-8 is a state-of-the-art machine with advanced computing capability. It has 32K RAM, high-resolution 8-color graphics, 4 audio channels, and a built-in powerful programming environment.'
      ],

      [
        "We will demonstrate SCRIPT-8's superior capabilities by making a basic pong game.",
        'Click the NEW button on the top menu to the left.'
      ],

      [
        'Good.',
        'All SCRIPT-8 games have update and draw subroutines.',
        'Every 30th of a second, the update subroutine is called, followed by the draw subroutine.'
      ],

      [
        'Our game will have two shapes: a paddle and a ball.',
        "Let's draw the paddle first."
      ],

      [
        'The rectFill subroutine draws a filled rectangle.',
        'It takes 5 parameters: (x, y, width, height, color,).',
        "Let's draw the ball next."
      ],

      [
        'The circFill subroutine draws a filled circle.',
        'It takes 4 parameters: (x, y, radius, color).',
        "We should probably use a different color for the game background. Let's do that."
      ],

      [
        'Not bad.',
        "Before we move on, let's do a bit of organizing.",
        "We'll create a paddle object."
      ],

      ["Let's also create a ball object."]
    ]

    const ps = slides[tutorial] || []

    return (
      <div
        className={classNames(`Tutorial slide-${tutorial}`, {
          hide: tutorial === false
        })}
      >
        {tutorial}
        {ps.map((d, i) => <p key={i}>{d}</p>)}
        {buttons}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tutorial)
