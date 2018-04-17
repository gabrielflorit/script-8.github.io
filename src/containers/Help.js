import React, { Component } from 'react'
import { connect } from 'react-redux'
import TopBar from '../components/TopBar.js'
import actions from '../actions/actions.js'
import screenTypes from '../utils/screenTypes.js'

const mapStateToProps = ({ screen }) => ({ screen })

const mapDispatchToProps = dispatch => ({
  setScreen: screen => dispatch(actions.setScreen(screen)),
  newGame: screen => dispatch(actions.newGame(screen)),
  setTutorialSlide: slide => dispatch(actions.setTutorialSlide(slide))
})

class Help extends Component {
  constructor (props) {
    super(props)
    this.loadTutorial = this.loadTutorial.bind(this)
  }

  loadTutorial() {
    const { newGame, screen, setTutorialSlide, setScreen } = this.props
    newGame(screen)
    setTutorialSlide(1)
    setScreen(screenTypes.CODE)
  }

  render () {
    return (
      <div className='Help'>
        <TopBar />
        <div className='main'>
          <ul className='top-list'>
            <li>
              <button className='button' onClick={this.loadTutorial}>LOAD</button> tutorial.
            </li>
            <li>
              Subroutines
              <ul className='second-list'>
                <li>
                  Draw
                  <ul className='third-list'>
                    <li>func print(x, y, letters, color)</li>
                    <li>func lineH(x, y, length, color, [isDotted=false])</li>
                    <li>func lineV(x, y, length, color, [isDotted=false])</li>
                    <li>func rectStroke(x, y, width, height, color)</li>
                    <li>func rectFill(x, y, width, height, color)</li>
                    <li>func circStroke(x, y, radius, color)</li>
                    <li>func circFill(x, y, radius, color)</li>
                    <li>func clear()</li>
                  </ul>
                </li>

                <li>
                  Sound
                  <ul className='third-list'>
                    <li>func playSong(song)</li>
                    <li>func stopSong()</li>
                  </ul>
                </li>

                <li>
                  Input
                  <ul className='third-list'>
                    <li>bool arrowUp</li>
                    <li>bool arrowRight</li>
                    <li>bool arrowDown</li>
                    <li>bool arrowLeft</li>
                  </ul>
                </li>

                <li>
                  Utility
                  <ul className='third-list'>
                    <li>func log(message)</li>
                    <li>func range([start=0], end, [step=1])</li>
                    <li>func flatten(array)</li>
                    <li>func clamp(number, [lower], upper)</li>
                    <li>func random([lower=0], [upper=1], [floating])</li>
                  </ul>
                </li>

                <li>
                  System
                  <ul className='third-list'>
                    <li>obj Math</li>
                    <li>obj Date</li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Help)
