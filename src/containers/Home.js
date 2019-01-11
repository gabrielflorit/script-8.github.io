import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => ({})

class Home extends Component {
  render () {
    return (
      <div className='Home'>
        <div className='main'>
          <p>
            SCRIPT-8 is a fantasy computer for making, sharing, and playing tiny
            retro-looking games (called cassettes). It's free and{' '}
            <a href='https://github.com/script-8/script-8.github.io'>
              open-source
            </a>
            .
          </p>
          <p>It has tools for editing code, sprites, maps, and music.</p>
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
