import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import actions from '../actions/actions.js'
import screenTypes from '../utils/screenTypes.js'
import slidesJson from '../utils/tutorial/slides.json'

// TUTORIAL data is in:
// - this file
// - the tutorial reducer
// - the tutorial folder

const intro = [
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
  ]
]

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

    setScreen(screenTypes.CODE)
    if (slide >= intro.length) {
      updateGame(
        `SCRIPT-8 TUTORIAL${slidesJson[slide - intro.length].code.join('\n')}`
      )
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

    // If tutorial is false, set slides to blank.
    // If tutorial is not false, and it's less than intro.length,
    // use that intro slide.
    // Otherwise, use the tutorial slide.
    let texts
    if (tutorial === false) {
      texts = []
    } else {
      if (tutorial < intro.length) {
        texts = intro[tutorial]
      } else {
        const slide = slidesJson[tutorial - intro.length]
        texts = slide.text
        if (tutorial === intro.length + slidesJson.length - 1) {
          buttons = (
            <div className='buttons'>
              {previous}
              {close}
            </div>
          )
        }
      }
    }

    return (
      <div
        className={classNames(`Tutorial slide-${tutorial}`, {
          hide: tutorial === false
        })}
      >
        {tutorial}
        {texts.map((d, i) => <p key={i}>{d}</p>)}
        {buttons}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tutorial)
