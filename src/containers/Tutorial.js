import React, { Component } from 'react'
import classNames from 'classnames'
import { isNil } from 'lodash'
import range from 'lodash/range'
import every from 'lodash/every'
import { connect } from 'react-redux'
import patcher from '../utils/patcher.js'
import screenTypes from '../iframe/src/utils/screenTypes.js'
import actions from '../actions/actions.js'
import lessons from '../utils/lessons.json'
import Map from './Map.js'

const areRequirementsMet = ({ requirements, props }) =>
  every(requirements, (value, key) => props[key] === value)

const mapStateToProps = ({ screen, tutorial, game }) => ({
  screen,
  tutorial,
  game
})

const mapDispatchToProps = dispatch => ({
  setCodeTab: tab => dispatch(actions.setCodeTab(tab)),
  newGame: () => dispatch(actions.newGame()),
  updateMap: newMap => dispatch(actions.updateMap(newMap)),
  setScreen: screen => dispatch(actions.setScreen(screen)),
  closeTutorial: () => dispatch(actions.closeTutorial()),
  updateGame: ({ tab, content }) =>
    dispatch(actions.updateGame({ tab, content })),
  updateSprite: ({ sprite, index }) =>
    dispatch(
      actions.updateSprite({
        sprite,
        index
      })
    ),
  setTutorialSlide: ({ lessonIndex, slideIndex }) =>
    dispatch(
      actions.setTutorialSlide({
        lessonIndex,
        slideIndex
      })
    )
})

class Tutorial extends Component {
  constructor(props) {
    super(props)
    this.handleClose = this.handleClose.bind(this)
    this.handlePrevious = this.handlePrevious.bind(this)
    this.handleNextSlide = this.handleNextSlide.bind(this)
    this.handleNextLesson = this.handleNextLesson.bind(this)
    this.handleSlide = this.handleSlide.bind(this)
    this.fireActions = this.fireActions.bind(this)
    this.buttonsElement = null
    this.setButtonsRef = e => {
      this.buttonsElement = e
    }
  }

  fireActions({ lessonIndex, slideIndex }) {
    const {
      setScreen,
      updateGame,
      updateSprite,
      updateMap,
      screen,
      setCodeTab
    } = this.props

    const lesson = lessons[lessonIndex]
    const { slides } = lesson
    const slide = slides[slideIndex]
    const { screen: slideScreen, game, sprites, map: slideMap } = slide

    if (!isNil(game)) {
      const patchedGame = patcher({ slides, index: slideIndex })
      // If we're not on CODE, set the game with no prefix.
      if (screen !== screenTypes.CODE) {
        updateGame({ tab: 0, content: patchedGame })
      } else {
        // If we are on CODE, use prefix.
        updateGame({ tab: 0, content: `SCRIPT-8 LESSON${patchedGame}` })
      }
    }

    // If there are sprites, set them.
    if (sprites) {
      // console.log(sprites)
      sprites.forEach(({ array, index }) =>
        updateSprite({ sprite: array, index })
      )
    }

    if (slideMap) {
      let newMap = Map.createBlankMap()
      slideMap.forEach(d => {
        const [row, col, value] = d.split('-')
        newMap[+row][+col] = value ? +value : null
      })
      updateMap(newMap)
    }

    // Set the screen, if we have one.
    if (slideScreen) {
      setScreen(slideScreen)
      // If the slide screen is CODE, go to the first tab.
      if (slideScreen === screenTypes.CODE) {
        setCodeTab(0)
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { tutorial, screen } = this.props
    const { lessonIndex, slideIndex } = tutorial
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

    if (screen === screenTypes.RUN) {
      this.buttonsElement.scrollIntoView()
    }
  }

  handleClose() {
    this.props.closeTutorial()
  }

  handleSlide({ lessonIndex, slideIndex }) {
    this.props.setTutorialSlide({ lessonIndex, slideIndex })
    this.fireActions({ lessonIndex, slideIndex })
  }

  handleNextLesson() {
    const { lessonIndex } = this.props.tutorial
    this.handleSlide({ lessonIndex: lessonIndex + 1, slideIndex: 0 })
  }

  handleNextSlide() {
    const { lessonIndex, slideIndex } = this.props.tutorial
    const { newGameOnNext } = lessons[lessonIndex].slides[slideIndex]
    if (newGameOnNext) {
      this.props.newGame(this.props.screen)
    }
    this.handleSlide({ lessonIndex, slideIndex: slideIndex + 1 })
  }

  handlePrevious() {
    const { lessonIndex, slideIndex } = this.props.tutorial
    this.handleSlide({ lessonIndex, slideIndex: slideIndex - 1 })
  }

  render() {
    const { tutorial, screen, tutorialRef } = this.props
    const { lessonIndex, slideIndex } = tutorial
    const { title, slides } = lessons[lessonIndex]
    const slide = slides[slideIndex]
    const { requirements } = slide
    const close = (
      <button className="button" onClick={this.handleClose}>
        close
      </button>
    )

    const enableNextSlide = requirements
      ? areRequirementsMet({ requirements, props: this.props })
      : true

    const nextSlide =
      slideIndex < slides.length - 1 ? (
        <button
          className="button"
          disabled={!enableNextSlide}
          onClick={this.handleNextSlide}
        >
          next
        </button>
      ) : null

    const nextLesson =
      slideIndex === slides.length - 1 && lessonIndex < lessons.length - 1 ? (
        <button className="button" onClick={this.handleNextLesson}>
          next lesson
        </button>
      ) : null

    const previous =
      slideIndex > 0 ? (
        <button className="button" onClick={this.handlePrevious}>
          previous
        </button>
      ) : null

    const buttons = (
      <div className="buttons" ref={this.setButtonsRef}>
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
      <div
        className={classNames('Tutorial', {
          'in-run': screen === screenTypes.RUN
        })}
        ref={tutorialRef}
      >
        {description}
        {slide.text.map((p, i) => (
          <p
            key={i}
            className={classNames({
              code: p.startsWith('XX')
            })}
            dangerouslySetInnerHTML={{ __html: p.replace(/^XX/, '') }}
          />
        ))}
        <div className="bottom-bar">
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
