import React, { Component } from 'react'
import { interval } from 'd3-timer'
import classNames from 'classnames'
import { connect } from 'react-redux'
import actions from '../actions/actions.js'
import screenTypes from '../utils/screenTypes.js'

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
        setScreen(screenTypes.RUN)
      },
      '4': () => {
        setScreen(screenTypes.CODE)
      },
      '6': () => {
        setScreen(screenTypes.CODE)
        const code = `script8.update = function () {

}

script8.draw = function () {

}`
        let i = 1
        timer = interval(() => {
          const segment = code.slice(0, i)
          updateGame(`SCRIPT-8 TUTORIAL${segment}`)
          if (i < code.length) {
            i++
          } else {
            timer.stop()
            this.handleNextSlide()
          }
        })
      },
      '8': () => {
        setScreen(screenTypes.CODE)
        const pre = `script8.update = function () {

}

script8.draw = function () {
`
        const post = `
}`
        const code = '  rectFill(0, 0, 10, 30, 0)'

        let i = 1
        timer = interval(() => {
          const segment = code.slice(0, i)
          updateGame(`SCRIPT-8 TUTORIAL${pre}${segment}${post}`)
          if (i < code.length) {
            i++
          } else {
            timer.stop()
            this.handleNextSlide()
          }
        })
      },
      '10': () => {
        setScreen(screenTypes.CODE)
        const pre = `script8.update = function () {

}

script8.draw = function () {
  rectFill(0, 0, 10, 30, 0)
`
        const post = `
}`

        const code = '  rectStroke(20, 0, 10, 30, 0)'

        let i = 1
        timer = interval(() => {
          const segment = code.slice(0, i)
          updateGame(`SCRIPT-8 TUTORIAL${pre}${segment}${post}`)
          if (i < code.length) {
            i++
          } else {
            timer.stop()
            this.handleNextSlide()
          }
        })
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
    console.log('stopping timer')
    console.log(timer)
    timer && timer.stop()
    console.log(timer)
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

    const slides = {
      0: (
        <div>
          <div>?NEW_USER</div>
          <div>Load tutorial:</div>
          <div className='buttons'>
            >
            {next}
            {close}
          </div>
        </div>
      ),

      1: (
        <div>
          <p>
            SCRIPT-8 is a state-of-the-art machine with advanced computing
            capability. It has 32K RAM, high-resolution 8-color graphics, and 4
            audio channels.
          </p>
          <p>
            But SCRIPT-8 is more than just a sophisticated computer. It is also
            a powerful programming environment.
          </p>
          <p>
            We will demonstrate SCRIPT-8's superior capabilities by making a
            game.
          </p>
          <div className='buttons'>
            >
            {next}
            {close}
          </div>
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
          <div className='buttons'>
            >
            {previous}
            {next}
            {close}
          </div>
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
          <div className='buttons'>
            >
            {previous}
            {next}
            {close}
          </div>
        </div>
      ),

      4: (
        <div>
          <p>Let's start a new game.</p>
          <p>Click the NEW button on the top menu to the left.</p>
          <div className='buttons'>
            >
            {previous}
            {close}
          </div>
        </div>
      ),

      5: (
        <div>
          <p>Good.</p>
          <p>All SCRIPT-8 games have update and draw subroutines.</p>
          <p>
            Every 30th of a second, the update subroutine is called, followed by
            the draw subroutine.
          </p>
          <div className='buttons'>
            >
            {previous}
            {next}
            {close}
          </div>
        </div>
      ),

      6: (
        <div>
          <p>Good.</p>
          <p>All SCRIPT-8 games have update and draw subroutines.</p>
          <p>
            Every 30th of a second, the update subroutine is called, followed by
            the draw subroutine.
          </p>
          <div className='buttons invisible'>
            >
            {previous}
            {next}
            {close}
          </div>
        </div>
      ),

      7: (
        <div>
          <p>Now we're ready to draw our first shape.</p>
          <div className='buttons'>
            >
            {previous}
            {next}
            {close}
          </div>
        </div>
      ),

      8: (
        <div>
          <p>The rectFill subroutine draws a rectangle.</p>
          <p>It takes 5 parameters: (x, y, width, height, color)</p>
          <p>Let's try the rectStroke subroutine next.</p>
          <div className='buttons invisible'>
            >
            {previous}
            {next}
            {close}
          </div>
        </div>
      ),

      9: (
        <div>
          <p>The rectFill subroutine draws a rectangle.</p>
          <p>It takes 5 parameters: (x, y, width, height, color)</p>
          <p>Let's try the rectStroke subroutine next.</p>
          <div className='buttons'>
            >
            {previous}
            {next}
            {close}
          </div>
        </div>
      ),
      10: (
        <div>
          <p />
          <div className='buttons'>
            >
            {previous}
            {next}
            {close}
          </div>
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
