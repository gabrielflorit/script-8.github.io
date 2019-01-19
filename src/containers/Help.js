import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import actions from '../actions/actions.js'
import lessons from '../utils/lessons.json'
import apiDocs from '../utils/apiDocs.json'

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
              FAQ
              <dl>
                <dt>What is SCRIPT-8's resolution?</dt>
                <dd>128 pixels by 128 pixels.</dd>
                <dt>How do I use colors?</dt>
                <dd>
                  There are 8 colors, from 0 (brightest) to 7 (darkest). But
                  they wrap around: 8 is 0 is 16, etc.
                </dd>
                <dt>What is the frame rate?</dt>
                <dd>
                  SCRIPT-8 tries to draw at 60fps, or a new frame every 16.6ms.
                  This might vary due to many factors: device capabilities, game
                  code, battery status, etc.
                </dd>
                <dt>How do I use the slider?</dt>
                <dd>
                  In CODE, click on a number. Hold the Shift key (or Command, if
                  you're on a Mac) and move the slider.
                </dd>
                <dt>How do I display my cassette's title in SHELF?</dt>
                <dd>
                  In CODE, set the first line as `// title: My Title`. Once you
                  put the cassette on SHELF, your title will show up.
                </dd>
              </dl>
            </li>
          </ul>

          <ul className='top-list'>
            <li>
              API documentation
              <ul className='second-list'>
                {apiDocs.map((section, i) => (
                  <li key={i}>
                    {section.title}
                    {section.note ? <span> ({section.note})</span> : null}
                    <dl>
                      {section.dl.map(([dt, dd], j) => (
                        <Fragment key={j}>
                          <dt>{dt}</dt>
                          <dd dangerouslySetInnerHTML={{ __html: dd }} />
                        </Fragment>
                      ))}
                    </dl>
                  </li>
                ))}
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
