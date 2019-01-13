import React, { Component } from 'react'
// import classNames from 'classnames'
import { connect } from 'react-redux'
import actions from '../actions/actions.js'
// import screenTypes from '../utils/screenTypes.js'
// import slidesJson from '../utils/tutorial/slides.json'

const tutorials = [
  {
    title: 'Hello world!',
    slides: [
      [
        'say hello to reader',
        'inform this is a tutorial. and that they can close it.',
        "show what we're going to make",
        'then start!'
      ]
    ]
  }
]

// TUTORIAL data is in:
// - the tutorial reducer
// - the tutorial folder

const mapStateToProps = ({ tutorial }) => ({
  tutorial
})

const mapDispatchToProps = dispatch => ({
  // setScreen: screen => dispatch(actions.setScreen(screen)),
  closeTutorial: () => dispatch(actions.closeTutorial())
  // newGame: screen => dispatch(actions.newGame(screen)),
  // updateGame: game => dispatch(actions.updateGame(game)),
  // setTutorialSlide: slide => dispatch(actions.setTutorialSlide(slide))
})

class Tutorial extends Component {
  constructor (props) {
    super(props)
    this.handleClose = this.handleClose.bind(this)
    // this.handleNextSlide = this.handleNextSlide.bind(this)
    // this.handlePreviousSlide = this.handlePreviousSlide.bind(this)
    // this.handleSlide = this.handleSlide.bind(this)
    // this.fireActions = this.fireActions.bind(this)
  }

  handleClose () {
    this.props.closeTutorial()
  }

  // fireActions (slide) {
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
  // }

  // handleSlide (slide) {
  //   this.props.setTutorialSlide(slide)
  //   this.fireActions(slide)
  // }

  // handleNextSlide () {
  //   this.handleSlide(this.props.tutorial + 1)
  // }

  // handlePreviousSlide () {
  //   this.handleSlide(this.props.tutorial - 1)
  // }

  render () {
    const { master, slide } = this.props.tutorial
    const { title, slides } = tutorials[master]

    // const previous = (
    //   <button className='button' onClick={this.handlePreviousSlide}>
    //     previous
    //   </button>
    // )

    // const next = (
    //   <button className='button' onClick={this.handleNextSlide}>
    //     {tutorial === 0 ? 'yes' : 'next'}
    //   </button>
    // )

    // const close = (
    //   <button className='button' onClick={this.handleClose}>
    //     {tutorial === 0 ? 'no' : 'close'}
    //   </button>
    // )

    const close = (
      <button className='button' onClick={this.handleClose}>
        close
      </button>
    )

    const next = (
      <button className='button' onClick={this.handleClose}>
        next
      </button>
    )

    const previous = (
      <button className='button' onClick={this.handleClose}>
        previous
      </button>
    )

    // const texts =
    //   tutorial > 0
    //     ? slidesJson[tutorial - 1].text.split('\n')
    //     : ['HELLO NEW_USER', 'Load tutorial?']

    // const buttons = (
    //   <div className='buttons'>
    //     {tutorial > 1 ? previous : null}
    //     {tutorial < slidesJson.length ? next : null}
    //     {close}
    //   </div>
    // )

    const buttons = (
      <div className='buttons'>
        {previous}
        {next}
        {close}
      </div>
    )

    return (
      <div className='Tutorial'>
        <div className='top-bar'>
          <p>
            Tutorial {master}: {title}
          </p>
          {buttons}
        </div>
        {slides[slide].map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    )

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
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tutorial)
