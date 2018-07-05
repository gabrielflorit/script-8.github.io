import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => ({})

class Help extends Component {
  render () {
    return (
      <div className='Help'>
        <div className='main'>
          <ul className='top-list'>
            <li>
              Subroutines
              <ul className='second-list'>
                <li>
                  Draw
                  <ul className='third-list'>
                    <li>func print(x, y, letters, color)</li>
                    <li>func line(x1, y1, x2, y2, color)</li>
                    <li>func rectStroke(x, y, width, height, color)</li>
                    <li>func rectFill(x, y, width, height, color)</li>
                    <li>func circStroke(x, y, radius, color)</li>
                    <li>func circFill(x, y, radius, color)</li>
                    <li>func polyStroke(points, [rotate, [x, y]], color)</li>
                    <li>func sprite(x, y, spriteIndex, [brighten])</li>
                    <li>func clear()</li>
                  </ul>
                </li>

                <li>
                  Sound
                  <ul className='third-list'>
                    <li>func playPhrase(phrase)</li>
                    <li>func playSong(song, [loop=false])</li>
                    <li>func stopSong()</li>
                  </ul>
                </li>

                <li>
                  Utility
                  <ul className='third-list'>
                    <li>func log(message)</li>
                    <li>func range([start=0], end, [step=1])</li>
                    <li>func flatten(array)</li>
                    <li>func random([lower=0], [upper=1], [floating])</li>
                    <li>func clamp(number, [lower], upper)</li>
                  </ul>
                </li>

                <li>
                  System
                  <ul className='third-list'>
                    <li>obj Math</li>
                    <li>obj Object</li>
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
