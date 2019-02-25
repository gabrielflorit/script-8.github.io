import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import actions from '../actions/actions.js'
import lessons from '../utils/lessons.json'
import apiDocs from '../utils/apiDocs.json'
import howTo from '../utils/howTo.json'
import shortcuts from '../utils/shortcuts.json'

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
  constructor(props) {
    super(props)
    this.handleLesson = this.handleLesson.bind(this)
  }

  handleLesson(lessonIndex) {
    this.props.setLessonIndex(lessonIndex)
  }

  render() {
    return (
      <div className="Help">
        <div className="main">
          <ul className="top-list">
            <li>
              SCRIPT-8 is written by Gabriel Florit (that's me!) and{' '}
              <a
                className="text"
                href="https://github.com/script-8/script-8.github.io/graphs/contributors"
              >
                dedicated contributors
              </a>
              . Do you have a question? Or perhaps you found a bug? Tweet me at{' '}
              <a className="text" href="https://twitter.com/gabrielflorit">
                @gabrielflorit
              </a>{' '}
              and I'll be glad to help out. And visit the Github repository{' '}
              <a
                className="text"
                href="https://github.com/script-8/script-8.github.io"
              >
                here
              </a>
              , where you can keep up with new features and the occasional bug
              fix.
            </li>

            <li>
              If you have any further questions, come join us on the{' '}
              <a className="text" href="https://discord.gg/HA68FNX">
                Fantasy Consoles Discord server
              </a>
              , a friendly place to chat about these sophisticated, cutting-edge
              computers. The server has a dedicated SCRIPT-8 room.
            </li>

            <li>
              Lessons
              <ul className="lessons">
                {lessons.map((lesson, i) => (
                  <li key={i}>
                    <button
                      className="button"
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

          <ul className="top-list how">
            <li>
              FAQ
              <dl>
                {howTo.map(([dt, dd], i) => (
                  <Fragment key={i}>
                    <dt>{dt}</dt>
                    <dd dangerouslySetInnerHTML={{ __html: dd }} />
                  </Fragment>
                ))}
              </dl>
            </li>
          </ul>

          <ul className="top-list">
            <li>
              Keyboard shortcuts
              <dl>
                {shortcuts.map(([dt, dd], i) => (
                  <Fragment key={i}>
                    <dt>{dt}</dt>
                    <dd dangerouslySetInnerHTML={{ __html: dd }} />
                  </Fragment>
                ))}
              </dl>
            </li>
          </ul>

          <ul className="top-list">
            <li>
              API documentation
              <ul className="second-list">
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
