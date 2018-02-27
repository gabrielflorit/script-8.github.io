import React from 'react'
import { connect } from 'react-redux'
import Boot from './Boot.js'
import Sfx from './Sfx.js'
import Run from './Run.js'
import Editor from './Editor.js'
import screenTypes from '../utils/screenTypes.js'
import '../css/App.css'

const mapStateToProps = ({ screen }) => ({
  screen
})

const mapDispatchToProps = () => ({})

const App = ({ screen }) => {
  const options = {
    [screenTypes.BOOT]: () => <Boot />,
    [screenTypes.SFX]: () => <Sfx />,
    [screenTypes.RUN]: () => <Run />,
    [screenTypes.CODE]: () => <Editor />
  }

  const component = options[screen]()

  return <div className='App'>{component}</div>
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
