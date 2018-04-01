import React from 'react'
import { connect } from 'react-redux'
import includes from 'lodash/includes'
import classNames from 'classnames'
import Boot from './Boot.js'
import Phrase from './Phrase.js'
import Chain from './Chain.js'
import Song from './Song.js'
import Run from './Run.js'
import Code from './Code.js'
import ErrorBoundary from '../components/ErrorBoundary.js'
import screenTypes from '../utils/screenTypes.js'
import { version } from '../../package.json'
import '../css/App.css'

console.log(JSON.stringify(`SCRIPT-8 api v ${version}`, null, 2))

const mapStateToProps = ({ screen }) => ({
  screen
})

const mapDispatchToProps = () => ({})

const options = {
  [screenTypes.BOOT]: () => <Boot />,
  [screenTypes.PHRASE]: () => <Phrase />,
  [screenTypes.CHAIN]: () => <Chain />,
  [screenTypes.SONG]: () => <Song />,
  [screenTypes.RUN]: () => <Run />,
  [screenTypes.CODE]: () => <Code />
}

const App = ({ screen }) => (
  <ErrorBoundary>
    <div
      className={classNames('App', {
        'full-height': includes(
          [screenTypes.BOOT, screenTypes.RUN, screenTypes.CODE],
          screen
        )
      })}
    >
      {options[screen]()}
    </div>
  </ErrorBoundary>
)

export default connect(mapStateToProps, mapDispatchToProps)(App)
