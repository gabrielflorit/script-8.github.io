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

    this.codeMirror.on('mousedown', (cm, e) => {
      // const rect = this._wrapper.getBoundingClientRect()
      // const coords = [e.clientX, e.clientY]

      // const offset = { left: rect.left - coords[0] - rect.left, top: rect.top - coords[1] }

      // Get mouse coordinates respective to viewport.
      const viewportMouseCoords = {
        left: e.clientX + cm.defaultCharWidth(),
        top: e.clientY
      }

      // Get position under mouse coordinates.
      const coordsChar = cm.coordsChar(viewportMouseCoords)

      // Get token for this position.
      const token = cm.getTokenAt(coordsChar)

      console.log(token)

      // If it's a number,
      if (token && token.type === 'number') {
        // move the slider here.
        this._slider.style.top = `${viewportMouseCoords.top}px`
        this._slider.style.left = `${viewportMouseCoords.left}px`
        this._slider.classList.remove('hide')
      }

      // console.log(this._wrapper.offset())

      // const offset = [e.offsetX, e.offsetY]

      // console.log(documentCoords)

      // const normalizedOffset = [
      //   offset[0] * width / rect.width,
      //   offset[1] * this.height / rect.height
      // ]

      // const token = cm.getTokenAt(cursor)
      // if (token && token.type === 'number') {
      //   const coords = cm.charCoords(cursor)
      //   console.log(coords)
      //   console.log(this._slider)
      //   // this.setState({
      //   //   slider: {
      //   //     top: coords.top,
      //   //     left: coords.left
      //   //   }
      //   // })
      // }
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
    if (nextProps.game.startsWith('//SCRIPT-8 WEBSOCKET')) {
      this.setContents(nextProps.game.replace('//SCRIPT-8 WEBSOCKET\n', ''))
    }
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
            ref={_slider => {
              this._slider = _slider
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
