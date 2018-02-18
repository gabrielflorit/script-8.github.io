import React, { Component } from 'react'
import PropTypes from 'prop-types'
import demo from '../utils/editorDemo.js'
import setupLinter from '../utils/setupLinter.js'

class CodeEditor extends Component {
  componentDidMount () {
    setupLinter()
    const codeMirror = window.CodeMirror(this._editor, {
      mode: 'javascript',
      theme: 'paraiso-dark',
      lineNumbers: true,
      lint: true,
      gutters: ['CodeMirror-lint-markers']
    })

    codeMirror.on('change', cm => {
      const content = cm.getValue()
      this.props.onUpdate(content)
    })

    setTimeout(() => {
      codeMirror.setValue(demo)
    }, 1000)
  }

  shouldComponentUpdate () {
    return false
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
  onUpdate: PropTypes.func.isRequired
}

export default CodeEditor
