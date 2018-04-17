import React, { Component } from 'react'
import PropTypes from 'prop-types'
import setupLinter from '../utils/setupLinter.js'
import commands from '../utils/commands.js'
import blank from '../utils/blank.js'

class CodeEditor extends Component {
  constructor (props) {
    super(props)

    this.setContents = this.setContents.bind(this)
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

    // This timeout is to force CodeMirror to set
    // its layout correctly, so it knows how to draw cursors.
    setTimeout(() => {
      this.setContents(this.props.game || '')
    }, 1000)
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
    if (nextProps.game.startsWith('SCRIPT-8 TUTORIAL')) {
      this.setContents(nextProps.game.replace('SCRIPT-8 TUTORIAL', ''))
    }
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
