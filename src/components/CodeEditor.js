import React, { Component } from 'react'
import PropTypes from 'prop-types'
import demo from '../utils/editorDemo.js'

class CodeEditor extends Component {
  cm: null

  componentDidMount () {
    this.cm = window.CodeMirror(this._editor, {
      value: demo,
      mode: 'javascript',
      theme: 'paraiso-dark'
    })
  }

  render () {
    return (
      <div className='CodeEditor'>
        <div
          className='_editor'
          ref={_editor => {
            this._editor = _editor
          }}
        />
        this is the code editor
      </div>
    )
  }
}

CodeEditor.propTypes = {
  input: PropTypes.string,
  onInput: PropTypes.func
}

export default CodeEditor
