import React, { Component } from 'react'
import { connect } from 'react-redux'
import logo from '../images/logo.png'
import loshermanosbrosgif from '../images/loshermanosbros-lite.gif'
import breakoutgif from '../images/breakout-lite.gif'
import brospipegif from '../images/brospipe-lite.gif'
import bigdemo from '../images/bigdemo.gif'

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => ({})

class Home extends Component {
  render () {
    return (
      <div className='Home'>
        <div className='main'>
          <img className='logo' src={logo} alt='SCRIPT-8 logo' />
          <p>
            SCRIPT-8 is a fantasy computer for making, sharing, and playing tiny
            retro-looking games (called cassettes). It's free and{' '}
            <a
              className='text'
              href='https://github.com/script-8/script-8.github.io'
            >
              open-source
            </a>
            .
          </p>
          <p className='gifs'>
            <a href='https://script-8.github.io/?id=cd8d6811adb3afb472aaf7505729cf01'>
              <img
                className='gif'
                src={loshermanosbrosgif}
                alt='Los hermanos bros'
              />
            </a>
            <a href='https://script-8.github.io/?id=1c4ae6ff3727cb4a0e344e3435aa16b2'>
              <img className='gif' src={breakoutgif} alt='break-8 game' />
            </a>
            <a href='https://script-8.github.io/?id=7f370bc716aff805f593a3f80008711f'>
              <img className='gif' src={brospipegif} alt='the plumber' />
            </a>
          </p>
          <p>
            It has tools for editing code, sprites, maps, and music. Edits take
            place instantly, even if the game is running.
          </p>
          <img className='gif wide' src={bigdemo} alt='script-8 tools' />

          <p>Each cassette is recorded to a URL you can share with anyone.</p>
          <p>Play cassettes with a keyboard or gamepad.</p>
          <p>
            You can inspect any cassette's contents (even if it's not yours),
            change the code, art, or music, and record it to a different
            cassette — a new version.
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
