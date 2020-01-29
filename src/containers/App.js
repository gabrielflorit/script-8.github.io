/*
TODO
- on insert new, probably best to run clear() and also stop any music.
- the cassettes on SHELF don't correctly reflect last updated. fix this.
*/

import React, { Component } from 'react'
import { connect } from 'react-redux'
import includes from 'lodash/includes'
import classNames from 'classnames'
import _ from 'lodash'
import Boot from './Boot.js'
import Home from './Home.js'
import Output from './Output.js'
import Sprite from './Sprite.js'
import Map from './Map.js'
import Phrase from './Phrase.js'
import Chain from './Chain.js'
import Song from './Song.js'
import Tutorial from './Tutorial.js'
import Code from './Code.js'
import Help from './Help.js'
import Shelf from './Shelf.js'
import Notice from './Notice.js'
import Comments from '../components/Comments.js'
import TopBar from '../components/TopBar.js'
import ErrorBoundary from '../components/ErrorBoundary.js'
import screenTypes from '../iframe/src/utils/screenTypes.js'
import notices from '../utils/notices.json'
import { version } from '../iframe/package.json'
import '../css/App.css'

console.log(JSON.stringify(`SCRIPT-8 app v ${version}`, null, 2))

const mapStateToProps = ({
  gist,
  screen,
  tutorial,
  dismissedNotices,
  token,
  hideMenu
}) => ({
  gist,
  screen,
  tutorial,
  dismissedNotices,
  token,
  hideMenu
})

const mapDispatchToProps = () => ({})

// Show notice only if:
// - we're logged in
// - we're the owner of this cassette
// - there is at least one notice we haven't dismissed
const shouldShowNotice = props => {
  const { gist, token } = props

  // If gistLogin is null, gist was created anonymously.
  const gistLogin = _.get(gist, 'data.owner.login', null)

  // If gistLogin does not match currentLogin, gist wasn't created by us.
  const currentLogin = _.get(token, 'user.login', null)

  // Are we owner of this cassette?
  const isMine = currentLogin && currentLogin === gistLogin

  // Is there at least one notice we haven't dismissed?
  const newNoticeIds = _.difference(
    notices.map(d => d.id),
    props.dismissedNotices
  )

  return isMine && newNoticeIds.length
}

const options = {
  [screenTypes.BOOT]: () => <Boot />,
  [screenTypes.HOME]: () => <Home />,
  [screenTypes.SPRITE]: () => <Sprite />,
  [screenTypes.MAP]: () => <Map />,
  [screenTypes.PHRASE]: () => <Phrase />,
  [screenTypes.CHAIN]: () => <Chain />,
  [screenTypes.SONG]: () => <Song />,
  [screenTypes.RUN]: () => null,
  [screenTypes.CODE]: () => <Code />,
  [screenTypes.HELP]: () => <Help />,
  [screenTypes.SHELF]: () => <Shelf />
}

class App extends Component {
  constructor(props) {
    super(props)
    this.tutorialElement = React.createRef()
    this.appElement = null
    this.setAppElementRef = e => {
      this.appElement = e
    }
  }

  componentDidUpdate() {
    // Get the tutorial's height and set App's padding-bottom to this.
    if (this.tutorialElement && this.tutorialElement.current) {
      const { clientHeight } = this.tutorialElement.current
      this.appElement.style.paddingBottom = `${clientHeight}px`
    } else {
      this.appElement.style.paddingBottom = '0'
    }

    const showNotice = shouldShowNotice(this.props)

    if (showNotice) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }

  render() {
    const { screen, tutorial, hideMenu, token, gist } = this.props

    const gameId = _.get(gist, 'data.id', null)
    const showNotice = shouldShowNotice(this.props)

    return (
      <ErrorBoundary>
        <div
          ref={this.setAppElementRef}
          className={classNames('App', `App-${screen}`, {
            'full-height': includes(
              [screenTypes.BOOT, screenTypes.CODE],
              screen
            )
          })}
        >
          <TopBar hideMenu={hideMenu} />
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
          {showNotice ? <Notice /> : null}
          {screen === screenTypes.RUN && gameId && (
            <Comments gameId={gameId} token={token} />
          )}
        </div>
      </ErrorBoundary>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
