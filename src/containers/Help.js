import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../actions/actions.js'
import lessons from '../utils/lessons.json'

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => ({
  setLessonIndex: lessonIndex =>
    dispatch(
      actions.setTutorialSlide({
        lessonIndex,
        slideIndex: 0
      })
    )
})

class Help extends Component {
  constructor (props) {
    super(props)
    this.handleLesson = this.handleLesson.bind(this)
  }

  handleLesson (lessonIndex) {
    this.props.setLessonIndex(lessonIndex)
  }

  render () {
    return (
      <div className='Help'>
        <div className='main'>
          <ul className='top-list'>
            <li>
              Lessons
              <ul className='lessons'>
                {lessons.map((lesson, i) => (
                  <li key={i}>
                    <button
                      className='button'
                      onClick={() => {
                        this.handleLesson(i)
                      }}
                    >
                      {i} - {lesson.shortTitle || lesson.title}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          <ul className='top-list how'>
            <li>
              How do I...
              <dl>
                <dt>use the slider?</dt>
                <dd>
                  In CODE, click on a number. Hold the Shift key (or Command, if
                  you're on a Mac) and move the slider.
                </dd>
              </dl>
            </li>
          </ul>

          <ul className='top-list'>
            <li>
              API documentation
              <ul className='second-list'>
                <li>
                  Game loop (not stable)
                  <dl>
                    <dt>initialState</dt>
                    <dd>TODO</dd>
                    <dt>update(state, input, elapsed)</dt>
                    <dd>TODO</dd>
                    <dt>drawActors(state, fade)</dt>
                    <dd>TODO</dd>
                    <dt>draw(state)</dt>
                    <dd>TODO</dd>
                  </dl>
                </li>
                <li>
                  Draw (not stable)
                  <dl>
                    <dt>print(x, y, letters, color)</dt>
                    <dd>TODO</dd>
                    <dt>line(x1, y1, x2, y2, color)</dt>
                    <dd>TODO</dd>
                    <dt>rectStroke(x, y, width, height, color)</dt>
                    <dd>TODO</dd>
                    <dt>rectFill(x, y, width, height, color)</dt>
                    <dd>TODO</dd>
                    <dt>circStroke(x, y, radius, color)</dt>
                    <dd>TODO</dd>
                    <dt>circFill(x, y, radius, color)</dt>
                    <dd>TODO</dd>
                    <dt>polyStroke(points, [rotate, [x, y]], color)</dt>
                    <dd>TODO</dd>
                    <dt>sprite(x, y, spriteIndex, [brighten])</dt>
                    <dd>TODO</dd>
                    <dt>clear()</dt>
                    <dd>TODO</dd>
                  </dl>
                </li>

                <li>
                  Utility
                  <dl>
                    <dt>range([start=0], end, [step=1])</dt>
                    <dd>
                      Creates an array of numbers from `start` up to `end`, not
                      inclusive.{' '}
                      <a
                        className='text'
                        href='https://lodash.com/docs/4.17.11#range'
                      >
                        By Lodash
                      </a>
                      .
                    </dd>
                    <dt>flatten(array)</dt>
                    <dd>
                      Flattens `array` a single level deep.{' '}
                      <a
                        className='text'
                        href='https://lodash.com/docs/4.17.11#flatten'
                      >
                        By Lodash
                      </a>
                      .
                    </dd>
                    <dt>random([lower=0], [upper=1])</dt>
                    <dd>
                      Returns a random number between `lower` and `upper`.{' '}
                      <a
                        className='text'
                        href='https://lodash.com/docs/4.17.11#random'
                      >
                        By Lodash
                      </a>
                      .
                    </dd>
                    <dt>clamp(number, [lower], upper)</dt>
                    <dd>
                      Clamps `number` between inclusive `lower` and `upper`.{' '}
                      <a
                        className='text'
                        href='https://lodash.com/docs/4.17.11#clamp'
                      >
                        By Lodash
                      </a>
                      .
                    </dd>
                    <dt>log(message)</dt>
                    <dd>Prints `message` to browser console.</dd>
                  </dl>
                </li>

                <li>
                  Sound (not stable)
                  <dl>
                    <dt>playPhrase(phrase)</dt>
                    <dd>TODO</dd>
                    <dt>playSong(song, [loop=false])</dt>
                    <dd>TODO</dd>
                    <dt>stopSong()</dt>
                    <dd>TODO</dd>
                  </dl>
                </li>

                <li>
                  Camera (not stable)
                  <dl>
                    <dt>camera()</dt>
                    <dd>TODO</dd>
                  </dl>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Help)
