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
                {apiDocs.map((section, i) => (
                  <li key={i}>
                    {section.title}
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
