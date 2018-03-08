import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Boot from './Boot.js'
import Sfx from './Sfx.js'
import Run from './Run.js'
import Code from './Code.js'
import screenTypes from '../utils/screenTypes.js'
import { version } from '../../package.json'
import '../css/App.css'

console.log(JSON.stringify(`SCRIPT-8 v ${version}`, null, 2))

const mapStateToProps = ({ screen }) => ({
  screen
})

const mapDispatchToProps = () => ({})

const App = ({ screen }) => {
  const options = {
    [screenTypes.BOOT]: () => <Boot />,
    [screenTypes.SFX]: () => <Sfx />,
    [screenTypes.RUN]: () => <Run />,
    [screenTypes.CODE]: () => <Code />
  }

  const component = options[screen]()

  return (
    <div
      className={classNames('App', {
        'full-height': screen !== screenTypes.SFX
      })}
    >
      {component}
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
