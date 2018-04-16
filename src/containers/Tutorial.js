import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import actions from '../actions/actions.js'
import screenTypes from '../utils/screenTypes.js'
import slidesJson from '../utils/tutorial/slides.json'

// TUTORIAL data is in:
// - the tutorial reducer
// - the tutorial folder

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
    const { newGame, updateGame, setScreen, screen } = this.props

    const { code } = slidesJson[slide - 1]

    if (slide === 1) {
      newGame(screen)
    }

    // If we're not on the CODE screen,
    // set the game, and then switch.
    if (screen !== screenTypes.CODE) {
      updateGame(code)
      setScreen(screenTypes.CODE)
    } else {
      // If we are on the CODE screen,
      // set the game.
      updateGame(`SCRIPT-8 TUTORIAL${code}`)
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
        {tutorial === 0 ? 'yes' : 'next'}
      </button>
    )

    const close = (
      <button className='button' onClick={this.handleClose}>
        {tutorial === 0 ? 'no' : 'close'}
      </button>
    )

    const texts =
      tutorial > 0
        ? slidesJson[tutorial - 1].text.split('\n')
        : ['HELLO NEW_USER', 'Load tutorial?']

    const buttons = (
      <div className='buttons'>
        {tutorial > 1 ? previous : null}
        {next}
        {close}
      </div>
    )

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
