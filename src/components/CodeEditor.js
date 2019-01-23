import React, { Component } from 'react'
import PropTypes from 'prop-types'
import includes from 'lodash/includes'
import setupLinter from '../utils/setupLinter.js'
import commands from '../utils/commands.js'
import blank from '../iframe/src/blank.js'

const { platform } = window.navigator

class CodeEditor extends Component {
  constructor (props) {
    super(props)

    this.mark = null
    this.setContents = this.setContents.bind(this)
    this.handleSlider = this.handleSlider.bind(this)
    this.activateSlider = this.activateSlider.bind(this)
    this.hideSlider = this.hideSlider.bind(this)
  }

  componentDidMount () {
    setupLinter()
    this.codeMirror = window.CodeMirror(this._editor, {
      value: this.props.game || '',
      mode: 'javascript',
      theme: 'nyx8',
      lint: true,
      lineNumbers: true,
      tabSize: 2,
      cursorBlinkRate: 0,
      scrollbarStyle: null,
      extraKeys: window.CodeMirror.normalizeKeyMap({
        Tab: commands.tab,
        'Cmd-/': commands.comment,
        'Ctrl-/': commands.comment
      })
    })

    this.codeMirror.on('change', cm => {
      const content = cm.getValue()
      this.props.updateGame(content)
    })

    this.codeMirror.on('keydown', (cm, e) => {
      if (includes(platform, 'Mac')) {
        if (e.key === 'Meta') {
          this.activateSlider()
        }
      } else {
        if (e.key === 'Shift') {
          this.activateSlider()
        }
      }
    })

    // add this eventlistener to window
    window.addEventListener('keyup', this.hideSlider)

    // This timeout is to force CodeMirror to set
    // its layout correctly, so it knows how to draw cursors.
    setTimeout(() => {
      this.setContents(this.props.game || '')
    }, 1000)
  }

  hideSlider () {
    this.mark && this.mark.clear()
    this._slider.classList.add('hide')
  }

  activateSlider () {
    // If the cursor is on a number,
    // reset and show the slider.

    // Get cursor.
    const cursor = this.codeMirror.getCursor()

    // Get token for this position.
    const token = this.codeMirror.getTokenAt({
      ...cursor,
      ch: cursor.ch + 1
    })

    // If it's a number,
    if (token && token.type === 'number') {
      // clear out the previous mark,
      this.mark && this.mark.clear()

      // and mark this token.
      this.mark = this.codeMirror.markText(
        {
          line: cursor.line,
          ch: token.start
        },
        {
          line: cursor.line,
          ch: token.end
        },
        {
          className: 'slider-token'
        }
      )

      // get the token's middle point coords.
      const middleCoords = this.codeMirror.charCoords({
        line: cursor.line,
        ch: token.start
      })

      // Get the wrapper rect.
      const wrapperRect = this._wrapper.getBoundingClientRect()

      // Save token.
      const value = token.string

      const valueNumber = +value

      if (valueNumber >= -127 && valueNumber <= 127) {
        this._slider.min = -127
        this._slider.max = 127
        this._slider.value = valueNumber
      } else {
        this._slider.min = 0
        this._slider.max = valueNumber === 0 ? 10 : valueNumber * 2
        this._slider.value = valueNumber
      }

      // Position slider centered above token.
      this._slider.style.left = `${middleCoords.left -
        wrapperRect.left +
        (value.length * this.codeMirror.defaultCharWidth()) / 2}px`
      this._slider.style.top = `${middleCoords.top -
        wrapperRect.top -
        this.codeMirror.defaultTextHeight()}px`

      // Show slider.
      this._slider.classList.remove('hide')
    }
  }

  handleSlider (e) {
    // Get mark positions.
    const { from, to } = this.mark.find()

    // Calculate new token.
    const newToken = e.target.value.toString()

    // Change token content.
    this.codeMirror.replaceRange(newToken, from, to)

    // Re-select token.
    this.mark = this.codeMirror.markText(
      from,
      {
        ...from,
        ch: from.ch + newToken.length
      },
      {
        className: 'slider-token'
      }
    )
  }

  setContents (value) {
    this.codeMirror.setValue(value)
    this.codeMirror.refresh()
  }

  componentWillReceiveProps (nextProps) {
    // If the incoming game is the empty game code,
    // set CodeMirror's value to ''.
    if (nextProps.game === 'SCRIPT-8 NEW') {
      this.setContents(blank)
    }
    if (nextProps.game.startsWith('SCRIPT-8 LESSON')) {
      this.setContents(nextProps.game.replace('SCRIPT-8 LESSON', ''))
    }
    if (nextProps.game.startsWith('//SCRIPT-8 WEBSOCKET')) {
      this.setContents(nextProps.game.replace('//SCRIPT-8 WEBSOCKET\n', ''))
    }
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.hideSlider)
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    return (
      <div className='CodeEditor'>
        <div
          className='wrapper'
          ref={_wrapper => {
            this._wrapper = _wrapper
          }}
        >
          <div
            className='_editor'
            ref={_editor => {
              this._editor = _editor
            }}
          />
          <input
            type='range'
            className='slider hide'
            step={1}
            ref={_slider => {
              this._slider = _slider
            }}
            onInput={this.handleSlider}
          />
        </div>
      </div>
    )
  }
}

CodeEditor.propTypes = {
  updateGame: PropTypes.func.isRequired,
  game: PropTypes.string
}

export default CodeEditor
