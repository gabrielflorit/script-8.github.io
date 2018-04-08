import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import actions from '../actions/actions.js'

const mapStateToProps = ({ tutorial, screen }) => ({
  tutorial,
  screen
})

const mapDispatchToProps = dispatch => ({
  closeTutorial: () => dispatch(actions.closeTutorial()),
  setTutorialSlide: slide => dispatch(actions.setTutorialSlide(slide))
})

class Tutorial extends Component {
  constructor (props) {
    super(props)
    this.handleClose = this.handleClose.bind(this)
    this.handleNextSlide = this.handleNextSlide.bind(this)
    this.handlePreviousSlide = this.handlePreviousSlide.bind(this)
  }

  handleClose () {
    this.props.closeTutorial()
  }

  handleNextSlide () {
    const { setTutorialSlide, tutorial } = this.props
    setTutorialSlide(tutorial + 1)
  }

  handlePreviousSlide () {
    const { setTutorialSlide, tutorial } = this.props
    setTutorialSlide(tutorial - 1)
  }

  componentDidMount () {}

  render () {
    const { tutorial } = this.props

    const previous =
      tutorial > 1 ? (
        <button className='button' onClick={this.handlePreviousSlide}>
          previous
        </button>
      ) : null

    const buttons = (
      <div className='buttons'>
        >
        {previous}
        <button className='button' onClick={this.handleNextSlide}>
          next
        </button>
        <button className='button' onClick={this.handleClose}>
          close
        </button>
      </div>
    )

    const slides = {
      0: (
        <div>
          <div>?NEW_USER</div>
          <div>Load tutorial:</div>
          <div className='buttons'>
            >
            <button className='button' onClick={this.handleNextSlide}>
              YES
            </button>
            <button className='button' onClick={this.handleClose}>
              NO
            </button>
          </div>
        </div>
      ),

      1: (
        <div>
          <p>
            The SCRIPT-8 is a state-of-the-art machine with advanced computing
            capability. It has 32K RAM, high-resolution 8-color graphics, and 4
            audio channels.
          </p>
          <p>
            But the SCRIPT-8 is more than just a sophisticated computer. It is
            also a powerful programming environment.
          </p>
          <p>
            We will demonstrate SCRIPT-8's superior capabilities by making a
            game.
          </p>
          {buttons}
        </div>
      ),

      2: (
        <div>
          <p>
            This is the CODE mode. Commands entered in the text editor on the
            left are instantly evaluated and rendered in the display on the
            right.
          </p>
          <p>
            If your screen is narrower than 800 pixels, the display is hidden.
            In that case, switch to RUN to preview your work.
          </p>
          {buttons}
        </div>
      ),

      3: (
        <div>
          <p>
            This is the RUN mode. It renders your game for you and your friends
            to enjoy.
          </p>
          <p>
            This is the mode SCRIPT-8 displays after a successful boot sequence.
          </p>
          <p>Let's go back to CODE. We'll start writing our game now.</p>
          {buttons}
        </div>
      ),

      4: (
        <div>
          <p>here we fire new</p>
          {buttons}
        </div>
      )
    }

    return (
      <div
        className={classNames(`Tutorial slide-${tutorial}`, {
          hide: tutorial === false
        })}
      >
        {slides[tutorial]}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tutorial)
