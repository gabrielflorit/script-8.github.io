import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import actions from '../actions/actions.js'
import screenTypes from '../iframe/src/utils/screenTypes.js'
import logo from '../images/logo.png'
import { timestamp } from '../utils/timestamp.json'
import loshermanosbrosgif from '../images/loshermanosbros-lite.gif'
import breakoutgif from '../images/breakout-lite.gif'
import brospipegif from '../images/brospipe-lite.gif'
import livecoding480 from '../images/livecoding480.gif'
import slider480 from '../images/slider480.gif'
import pauserewind from '../images/pauserewind.gif'
import toggle from '../images/toggle.gif'
import spritedemo from '../images/spritedemo.gif'
import mapdemo from '../images/mapdemo.gif'
import musicdemo from '../images/musicdemo.gif'
import { version } from '../iframe/package.json'

const mapStateToProps = ({ tutorial }) => ({
  tutorial
})

const mapDispatchToProps = dispatch => ({
  setScreen: screen => dispatch(actions.setScreen(screen)),
  startTutorial: () =>
    dispatch(
      actions.setTutorialSlide({
        lessonIndex: 0,
        slideIndex: 0
      })
    )
})

class Home extends Component {
  constructor(props) {
    super(props)
    this.handleStartTutorial = this.handleStartTutorial.bind(this)
    this.handleSeeLessons = this.handleSeeLessons.bind(this)
    this.handleClickGifs = this.handleClickGifs.bind(this)
  }

  handleStartTutorial() {
    this.props.startTutorial()
  }

  handleSeeLessons() {
    this.props.setScreen(screenTypes.HELP)
  }

  handleClickGifs() {
    this.props.setScreen(screenTypes.SHELF)
  }

  render() {
    return (
      <div className="Home">
        <div className="main">
          <img className="logo" src={logo} alt="SCRIPT-8 logo" />
          <p className="last-updated">
            <span>updated {timestamp}</span>
            <span>v{version}</span>
          </p>
          <p>
            SCRIPT-8 is a fantasy computer for making, sharing, and playing tiny
            retro-looking games (called cassettes). It's free, browser-based,
            and{' '}
            <a
              className="text"
              href="https://github.com/script-8/script-8.github.io"
            >
              open-source
            </a>
            . Cassettes are written in JavaScript.
          </p>
          <p className="gifs">
            <button onClick={this.handleClickGifs}>
              <img
                className="gif"
                src={loshermanosbrosgif}
                alt="Los hermanos bros"
              />
            </button>
            <button onClick={this.handleClickGifs}>
              <img className="gif" src={breakoutgif} alt="break-8 game" />
            </button>
            <button onClick={this.handleClickGifs}>
              <img className="gif" src={brospipegif} alt="the plumber" />
            </button>
          </p>
          <p className="start">
            <button
              className={classNames('button', {
                invisible: this.props.tutorial
              })}
              onClick={this.handleStartTutorial}
            >
              > New? Start here
            </button>
            <button
              className={classNames('button', {
                invisible: this.props.tutorial
              })}
              onClick={this.handleSeeLessons}
            >
              > See lessons
            </button>
          </p>
          <p>
            SCRIPT-8 is designed to encourage play — the kind of wonder-filled
            play children experience as they explore and learn about the world.
            In order to support this goal, everything in SCRIPT-8 has immediate
            feedback. It is what some call a "livecoding" environment.
          </p>
          <p>It features:</p>
          <ul>
            <li>
              a code editor where the game changes as you type.
              <img className="gif wide" src={livecoding480} alt="livecoding" />
            </li>
            <li>
              a slider to help you tweak numbers without typing.
              <img className="gif wide" src={slider480} alt="slider" />
            </li>
            <li>
              <span>a time-traveling tool so you can pause and rewind.</span>
              <img
                className="gif wide single"
                src={pauserewind}
                alt="pause and rewind"
              />
            </li>
            <li>
              <span>
                buttons that show a character's past and future paths.
              </span>
              <img className="gif wide single" src={toggle} alt="toggle" />
            </li>
            <li>
              the ability to combine all the above so you can manipulate time.
              <iframe
                title="Demonstration of SCRIPT-8's time-traveling tool"
                width="560"
                height="315"
                src="https://www.youtube.com/embed/0rg5GGFaIY0"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />{' '}
            </li>
            <li>
              <span>
                a sprite editor where the game instantly displays your edits.
              </span>
              <img
                className="gif wide single"
                src={spritedemo}
                alt="sprite demo"
              />
            </li>
            <li>
              <span>
                a map editor where changes alter the game's behavior, in
                real-time.
              </span>
              <img className="gif wide single" src={mapdemo} alt="map demo" />
            </li>
            <li>
              <span>
                a music editor where you create phrases, group them into chains,
                and turn those into songs.
              </span>
              <img
                className="gif wide single"
                src={musicdemo}
                alt="music demo"
              />
            </li>
          </ul>

          <p>Each cassette is recorded to a URL you can share with anyone.</p>
          <p>Play cassettes with a keyboard or gamepad.</p>
          <p>
            You can inspect any cassette's contents (even if it's not yours),
            change the code, art, or music, and record it to a different
            cassette — a new version.
          </p>
          <p>
            SCRIPT-8 is heavily influenced by Bret Victor's ideas (specifically{' '}
            <a className="text" href="http://vimeo.com/36579366">
              Inventing on principle
            </a>{' '}
            and{' '}
            <a
              className="text"
              href="http://worrydream.com/LearnableProgramming/"
            >
              Learnable programming
            </a>
            ) and Joseph White's{' '}
            <a className="text" href="https://www.lexaloffle.com/pico-8.php">
              PICO-8
            </a>
            , the best of all fantasy consoles.
          </p>
          <p>
            SCRIPT-8 is written by Gabriel Florit (that's me!) and{' '}
            <a
              className="text"
              href="https://github.com/script-8/script-8.github.io/graphs/contributors"
            >
              dedicated contributors
            </a>
            . Click{' '}
            <a className="text" href="https://twitter.com/gabrielflorit">
              here
            </a>{' '}
            to follow me on twitter. And visit the Github repository{' '}
            <a
              className="text"
              href="https://github.com/script-8/script-8.github.io"
            >
              here
            </a>
            , where you can keep up with new features and the occasional bug
            fix.
          </p>
          <p>
            If you have any questions, come join us on the{' '}
            <a className="text" href="https://discord.gg/HA68FNX">
              Fantasy Consoles Discord server
            </a>
            , a friendly place to chat about these sophisticated, cutting-edge
            computers. The server has a dedicated SCRIPT-8 room.
          </p>
          <p>
            SCRIPT-8 nyx8 palette by{' '}
            <a className="text" href="https://twitter.com/Xavier_Gd">
              Javier Guerrero
            </a>
            . Sprites in{' '}
            <a
              className="text"
              href="https://script-8.github.io/?id=cd8d6811adb3afb472aaf7505729cf01"
            >
              Los Hermanos Bros.
            </a>{' '}
            by{' '}
            <a className="text" href="https://twitter.com/johanvinet">
              Johan Vinet
            </a>
            .
          </p>
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
