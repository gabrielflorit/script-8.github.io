import React, { Component } from 'react'
import { connect } from 'react-redux'
import range from 'lodash/range'
import every from 'lodash/every'
import actions from '../actions/actions.js'
import lessons from '../utils/lessons.js'

const areRequirementsMet = ({ requirements, props }) =>
  every(requirements, (value, key) => props[key] === value)

// TUTORIAL data is in:
// - the tutorial reducer
// - the tutorial folder

const mapStateToProps = ({ screen, tutorial }) => ({
  screen,
  tutorial
})

const mapDispatchToProps = dispatch => ({
  setScreen: screen => dispatch(actions.setScreen(screen)),
  closeTutorial: () => dispatch(actions.closeTutorial()),
  // newGame: screen => dispatch(actions.newGame(screen)),
  // updateGame: game => dispatch(actions.updateGame(game)),
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
    const { setScreen } = this.props

    const lesson = lessons[lessonIndex]
    const slide = lesson.slides[slideIndex]
    const { screen } = slide

    if (screen) {
      setScreen(screen)
    }

    // const { title, slides } = tutorials[master]
    //   const { newGame, updateGame, setScreen, screen } = this.props
    //   const { code } = slidesJson[slide - 1]
    //   if (slide === 1) {
    //     newGame(screen)
    //   }
    //   // If we're not on the CODE screen,
    //   // set the game, and then switch.
    //   if (screen !== screenTypes.CODE) {
    //     updateGame(code)
    //     setScreen(screenTypes.CODE)
    //   } else {
    //     // If we are on the CODE screen,
    //     // set the game.
    //     updateGame(`SCRIPT-8 TUTORIAL${code}`)
    //   }
  }

  componentDidUpdate (prevProps, prevState) {
    const { lessonIndex, slideIndex } = this.props.tutorial
    const { slides } = lessons[lessonIndex]
    const slide = slides[slideIndex]
    const { requirements } = slide

    // Check if we're on a slide with requirements,
    // and if those requirements were not previously met,
    // but they are now. And if so, advance.
    if (
      requirements &&
      !areRequirementsMet({ requirements, props: prevProps }) &&
      areRequirementsMet({ requirements, props: this.props })
    ) {
      this.handleNextSlide()
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
      <div className='Tutorial'>
        {description}
        {slide.text.map((p, i) => (
          <p key={i}>{p}</p>
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

// const texts =
//   tutorial > 0
//     ? slidesJson[tutorial - 1].text.split('\n')
//     : ['HELLO NEW_USER', 'Load tutorial?']

// return (
//   <div
//     className={classNames(`Tutorial slide-${tutorial}`, {
//       hide: tutorial === false
//     })}
//   >
//     {texts.map((d, i) => (
//       <p key={i} dangerouslySetInnerHTML={{ __html: d }} />
//     ))}
//   </div>
// )
