import React, { Component } from 'react'
import PropTypes from 'prop-types'
import setupLinter from '../utils/setupLinter.js'

class CodeEditor extends Component {
  componentDidMount () {
    setupLinter()
    const codeMirror = window.CodeMirror(this._editor, {
      value: this.props.game || '',
      mode: 'javascript',
      theme: 'nyx8',
      lint: true,
      lineNumbers: true,
      cursorBlinkRate: 0
    })

    codeMirror.on('change', cm => {
      const content = cm.getValue()
      this.props.updateGame(content)
    })

    // This timeout is to force CodeMirror to set
    // its layout correctly, so it knows how to draw cursors.
    setTimeout(() => {
      codeMirror.setValue(this.props.game || '')
      codeMirror.refresh()
    }, 1000)
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    return (
      <div className='CodeEditor'>
        <div className='wrapper'>
          <div
            className='_editor'
            ref={_editor => {
              this._editor = _editor
            }}
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
