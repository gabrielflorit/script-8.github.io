import React, { Component } from 'react'
import PropTypes from 'prop-types'
import setupLinter from '../utils/setupLinter.js'

class CodeEditor extends Component {
  componentDidMount () {
    setupLinter()
    const codeMirror = window.CodeMirror(this._editor, {
      value: this.props.game,
      mode: 'javascript',
      theme: 'nyx8',
      lint: true
      // lineNumbers: true,
      // gutters: ['CodeMirror-lint-markers']
    })

    codeMirror.on('change', cm => {
      const content = cm.getValue()
      this.props.onUpdate(content)
    })

    setTimeout(() => {
      codeMirror.setValue(this.props.game)
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
  onUpdate: PropTypes.func.isRequired,
  game: PropTypes.string
}

export default CodeEditor
