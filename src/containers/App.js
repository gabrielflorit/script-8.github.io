import React from 'react'
import { connect } from 'react-redux'
import includes from 'lodash/includes'
import classNames from 'classnames'
import Boot from './Boot.js'
import Sprite from './Sprite.js'
import Phrase from './Phrase.js'
import Chain from './Chain.js'
import Song from './Song.js'
import Run from './Run.js'
import Code from './Code.js'
// import Tutorial from './Tutorial.js'
import Help from './Help.js'
import Shelf from './Shelf.js'
import TopBar from '../components/TopBar.js'
import ErrorBoundary from '../components/ErrorBoundary.js'
import screenTypes from '../utils/screenTypes.js'
import { version } from '../iframe/package.json'
import '../css/App.css'

console.log(JSON.stringify(`SCRIPT-8 app v ${version}`, null, 2))

const mapStateToProps = ({ screen }) => ({
  screen
})

const mapDispatchToProps = () => ({})

const options = {
  [screenTypes.BOOT]: () => <Boot />,
  [screenTypes.SPRITE]: () => <Sprite />,
  [screenTypes.PHRASE]: () => <Phrase />,
  [screenTypes.CHAIN]: () => <Chain />,
  [screenTypes.SONG]: () => <Song />,
  [screenTypes.RUN]: () => <Run />,
  [screenTypes.CODE]: () => <Code />,
  [screenTypes.HELP]: () => <Help />,
  [screenTypes.SHELF]: () => <Shelf />
}

const App = ({ screen }) => (
  <ErrorBoundary>
    <div
      className={classNames('App', `App-${screen}`, {
        'full-height': includes(
          [screenTypes.BOOT, screenTypes.RUN, screenTypes.CODE],
          screen
        )
      })}
    >
      <TopBar />
      {options[screen]()}
    </div>
  </ErrorBoundary>
)

export default connect(mapStateToProps, mapDispatchToProps)(App)
