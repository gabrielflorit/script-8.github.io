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
      '2': () => {
        setScreen(screenTypes.CODE)
      },
      '3': () => {
        setScreen(screenTypes.CODE)
      },
      '4': () => {
        setScreen(screenTypes.CODE)
      },
      '5': () => {
        setScreen(screenTypes.CODE)
        updateGame(`SCRIPT-8 TUTORIAL${tutorial0}`)
      },
      '6': () => {
        setScreen(screenTypes.CODE)
        updateGame(`SCRIPT-8 TUTORIAL${tutorial1}`)
      },
      '7': () => {
        setScreen(screenTypes.CODE)
        updateGame(`SCRIPT-8 TUTORIAL${tutorial2}`)
      },
      '8': () => {
        setScreen(screenTypes.CODE)
        updateGame(`SCRIPT-8 TUTORIAL${tutorial3}`)
      },
      '9': () => {
        setScreen(screenTypes.CODE)
        updateGame(`SCRIPT-8 TUTORIAL${tutorial4}`)
      }
    }[slide]
    actions && actions()
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

    const slides = {
      0: (
        <div>
          <div>?NEW_USER</div>
          <div>Load tutorial:</div>
        </div>
      ),

      1: (
        <div>
          <p>
            SCRIPT-8 is a state-of-the-art machine with advanced computing
            capability. It has 32K RAM, high-resolution 8-color graphics, 4
            audio channels, and a built-in powerful programming environment.
          </p>
        </div>
      ),

      2: (
        <div>
          <p>
            We will demonstrate SCRIPT-8's superior capabilities by making a
            basic pong game.
          </p>
          <p>Click the NEW button on the top menu to the left.</p>
        </div>
      ),

      3: (
        <div>
          <p>Good.</p>
          <p>All SCRIPT-8 games have update and draw subroutines.</p>
          <p>
            Every 30th of a second, the update subroutine is called, followed by
            the draw subroutine.
          </p>
        </div>
      ),

      4: (
        <div>
          <p>Our game will have two shapes: a paddle and a ball.</p>
          <p>Let's draw the paddle first.</p>
        </div>
      ),

      5: (
        <div>
          <p>The rectFill subroutine draws a filled rectangle.</p>
          <p>It takes 5 parameters: (x, y, width, height, color).</p>
          <p>Let's draw the ball next.</p>
        </div>
      ),

      6: (
        <div>
          <p>The circFill subroutine draws a filled circle.</p>
          <p>It takes 4 parameters: (x, y, radius, color).</p>
          <p>
            We should probably use a different color for the game background.
            Let's do that.
          </p>
        </div>
      ),

      7: (
        <div>
          <p>Not bad.</p>
          <p>Before we move on, let's do a bit of organizing.</p>
          <p>We'll create a paddle object.</p>
        </div>
      ),

      8: (
        <div>
          <p>Let's also create a ball object.</p>
        </div>
      ),

      9: (
        <div>
          <p>Let's also create a ball object.</p>
        </div>
      )
    }

    return (
      <div
        className={classNames(`Tutorial slide-${tutorial}`, {
          hide: tutorial === false
        })}
      >
        {tutorial}
        {slides[tutorial]}
        {buttons}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tutorial)
