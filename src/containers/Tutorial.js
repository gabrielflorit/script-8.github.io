import React, { Component } from 'react'
import classNames from 'classnames'
import { isNil } from 'lodash'
import range from 'lodash/range'
import every from 'lodash/every'
import { connect } from 'react-redux'
import patcher from '../utils/patcher.js'
import screenTypes from '../utils/screenTypes.js'
import actions from '../actions/actions.js'
import lessons from '../utils/lessons.json'

const areRequirementsMet = ({ requirements, props }) =>
  every(requirements, (value, key) => props[key] === value)

const mapStateToProps = ({ screen, tutorial, game }) => ({
  screen,
  tutorial,
  game
})

const mapDispatchToProps = dispatch => ({
  setScreen: screen => dispatch(actions.setScreen(screen)),
  closeTutorial: () => dispatch(actions.closeTutorial()),
  updateGame: game => dispatch(actions.updateGame(game)),
  setTutorialSlide: ({ lessonIndex, slideIndex }) =>
    dispatch(
      actions.setTutorialSlide({
        lessonIndex,
        slideIndex
      })
    )
})

class Tutorial extends Component {
  constructor (props) {
    super(props)
    this.handleClose = this.handleClose.bind(this)
    this.handlePrevious = this.handlePrevious.bind(this)
    this.handleNextSlide = this.handleNextSlide.bind(this)
    this.handleNextLesson = this.handleNextLesson.bind(this)
    this.handleSlide = this.handleSlide.bind(this)
    this.fireActions = this.fireActions.bind(this)
  }

  fireActions ({ lessonIndex, slideIndex }) {
    const { setScreen, updateGame, screen } = this.props

    const lesson = lessons[lessonIndex]
    const { slides } = lesson
    const slide = slides[slideIndex]
    const { screen: slideScreen, game } = slide

    // If we're not on CODE, set the game with no prefix.
    // If we are on CODE, use prefix.
    if (!isNil(game)) {
      const patchedGame = patcher({ slides, index: slideIndex })
      if (screen !== screenTypes.CODE) {
        updateGame(patchedGame)
      } else {
        updateGame(`SCRIPT-8 LESSON${patchedGame}`)
      }
    }

    // Set the screen, if we have one.
    if (slideScreen) {
      setScreen(slideScreen)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { lessonIndex, slideIndex } = this.props.tutorial
    const { slides } = lessons[lessonIndex]
    const slide = slides[slideIndex]
    const { requirements } = slide

    // Check if we're on a slide with requirements,
    // and if those requirements were not previously met,
    // but they are now. And if so, advance.
    if (requirements) {
      if (!areRequirementsMet({ requirements, props: prevProps })) {
        if (areRequirementsMet({ requirements, props: this.props })) {
          this.handleNextSlide()
        }
      }
    }
  }

  handleClose () {
    this.props.closeTutorial()
  }

  handleSlide ({ lessonIndex, slideIndex }) {
    this.props.setTutorialSlide({ lessonIndex, slideIndex })
    this.fireActions({ lessonIndex, slideIndex })
  }

  handleNextLesson () {
    const { lessonIndex } = this.props.tutorial
    this.handleSlide({ lessonIndex: lessonIndex + 1, slideIndex: 0 })
  }

  handleNextSlide () {
    const { lessonIndex, slideIndex } = this.props.tutorial
    this.handleSlide({ lessonIndex, slideIndex: slideIndex + 1 })
  }

  handlePrevious () {
    const { lessonIndex, slideIndex } = this.props.tutorial
    this.handleSlide({ lessonIndex, slideIndex: slideIndex - 1 })
  }

  render () {
    const { lessonIndex, slideIndex } = this.props.tutorial
    const { title, slides } = lessons[lessonIndex]
    const slide = slides[slideIndex]
    const { requirements } = slide

    const close = (
      <button className='button' onClick={this.handleClose}>
        close
      </button>
    )

    const enableNextSlide = requirements
      ? areRequirementsMet({ requirements, props: this.props })
      : true

    const nextSlide =
      slideIndex < slides.length - 1 ? (
        <button
          className='button'
          disabled={!enableNextSlide}
          onClick={this.handleNextSlide}
        >
          next
        </button>
      ) : null

    const nextLesson =
      slideIndex === slides.length - 1 && lessonIndex < lessons.length - 1 ? (
        <button className='button' onClick={this.handleNextLesson}>
          next lesson
        </button>
      ) : null

    const previous =
      slideIndex > 0 ? (
        <button className='button' onClick={this.handlePrevious}>
          previous
        </button>
      ) : null

    const buttons = (
      <div className='buttons'>
        {previous}
        {nextLesson}
        {nextSlide}
        {close}
      </div>
    )

    const description =
      slideIndex === 0 ? (
        lessonIndex === 0 ? (
          <p>{title}</p>
        ) : (
          <p>
            Lesson {lessonIndex}: {title}
          </p>
        )
      ) : null

    const progress = range(slides.length)
      .map(i => (i === slideIndex ? '|' : '.'))
      .join('')

    return (
      <div className='Tutorial' ref={this.props.tutorialRef}>
        {description}
        {slide.text.map((p, i) => (
          <p
            key={i}
            className={classNames({
              code: p.startsWith('XX')
            })}
          >
            {p.replace(/^XX/, '')}
          </p>
        ))}
        <div className='bottom-bar'>
          {buttons}
          <p>{progress}</p>
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tutorial)
