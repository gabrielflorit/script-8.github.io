import React, { Component } from 'react'
import PropTypes from 'prop-types'
import demo from '../utils/editorDemo.js'
import setupLinter from '../utils/setupLinter.js'

class CodeEditor extends Component {
  componentDidMount () {
    setupLinter()
    window.CodeMirror(this._editor, {
      value: demo,
      mode: 'javascript',
      theme: 'paraiso-dark',
      lineNumbers: true,
      lint: true,
      gutters: ['CodeMirror-lint-markers']
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
      </div>
    )
  }
}

CodeEditor.propTypes = {
  input: PropTypes.string,
  onInput: PropTypes.func
}

export default CodeEditor
