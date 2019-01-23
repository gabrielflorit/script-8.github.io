import React, { Component } from 'react'
import { connect } from 'react-redux'
import includes from 'lodash/includes'
import classNames from 'classnames'
import Boot from './Boot.js'
import Home from './Home.js'
import Output from './Output.js'
import Sprite from './Sprite.js'
import Map from './Map.js'
import Phrase from './Phrase.js'
import Chain from './Chain.js'
import Song from './Song.js'
import Tutorial from './Tutorial.js'
import Run from './Run.js'
import Code from './Code.js'
import Help from './Help.js'
import Shelf from './Shelf.js'
import TopBar from '../components/TopBar.js'
import ErrorBoundary from '../components/ErrorBoundary.js'
import screenTypes from '../utils/screenTypes.js'
import { version } from '../iframe/package.json'
import '../css/App.css'

console.log(JSON.stringify(`SCRIPT-8 app v ${version}`, null, 2))

const mapStateToProps = ({ screen, tutorial }) => ({
  screen,
  tutorial
})

const mapDispatchToProps = () => ({})

const options = {
  [screenTypes.BOOT]: () => <Boot />,
  [screenTypes.HOME]: () => <Home />,
  [screenTypes.SPRITE]: () => <Sprite />,
  [screenTypes.MAP]: () => <Map />,
  [screenTypes.PHRASE]: () => <Phrase />,
  [screenTypes.CHAIN]: () => <Chain />,
  [screenTypes.SONG]: () => <Song />,
  [screenTypes.RUN]: () => <Run />,
  [screenTypes.CODE]: () => <Code />,
  [screenTypes.HELP]: () => <Help />,
  [screenTypes.SHELF]: () => <Shelf />
}

class App extends Component {
  constructor (props) {
    super(props)
    this.tutorialElement = React.createRef()
    this.appElement = null
    this.setAppElementRef = e => {
      this.appElement = e
    }
  }

  componentDidUpdate (prevProps, prevState) {
    // Get the tutorial's height and set App's padding-bottom to this.
    if (this.tutorialElement && this.tutorialElement.current) {
      const { clientHeight } = this.tutorialElement.current
      this.appElement.style.paddingBottom = `${clientHeight}px`
    } else {
      this.appElement.style.paddingBottom = '0'
    }
  }

  render () {
    const { screen, tutorial } = this.props
    return (
      <ErrorBoundary>
        <div
          ref={this.setAppElementRef}
          className={classNames('App', `App-${screen}`, {
            'full-height': includes(
              [screenTypes.BOOT, screenTypes.RUN, screenTypes.CODE],
              screen
            )
          })}
        >
          <TopBar />
          {options[screen]()}
          <Output />
          {tutorial ? (
            <Tutorial
              className={classNames({
                'in-RUN': screen === screenTypes.RUN
              })}
              tutorialRef={this.tutorialElement}
            />
          ) : null}
        </div>
      </ErrorBoundary>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
