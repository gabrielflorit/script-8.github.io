import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import _ from 'lodash'
import screenTypes, {
  getPreviousScreen,
  getNextScreen
} from '../iframe/src/utils/screenTypes.js'
import isDirty from '../utils/isDirty.js'
import getGameTitle from '../utils/getGameTitle.js'
import canRecord from '../utils/canRecord.js'
import isBlank from '../utils/isBlank.js'
import areYouSure from '../utils/areYouSure.js'
import actions, {
  saveGist,
  fetchToken,
  putOnShelf
} from '../actions/actions.js'
import { getActive } from '../reducers/game.js'
import { assembleOrderedGame } from '../iframe/src/gistParsers/game.js'
import { version } from '../iframe/package.json'

const { platform } = window.navigator

const downloadHtml = html => {
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(html)
  )
  element.setAttribute('download', 'index.html')
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

const mapStateToProps = ({
  iframeVersion,
  gist,
  game,
  sprites,
  map,
  phrases,
  chains,
  songs,
  token,
  shelving,
  screen,
  nextAction,
  sound
}) => ({
  iframeVersion,
  screen,
  gist,
  game,
  sprites,
  map,
  phrases,
  chains,
  songs,
  token,
  isFetching: gist.isFetching || token.isFetching || shelving,
  nextAction,
  sound
})

const mapDispatchToProps = dispatch => ({
  updateIframeVersion: () => dispatch(actions.updateIframeVersion()),
  clearToken: () => dispatch(actions.clearToken()),
  setCodeTab: tab => dispatch(actions.setCodeTab(tab)),
  toggleSound: () => dispatch(actions.toggleSound()),
  clearNextAction: () => dispatch(actions.clearNextAction()),
  fetchToken: token => dispatch(fetchToken(token)),
  newGame: screen => dispatch(actions.newGame(screen)),
  putOnShelf: ({ user, gist, cover, title, isFork, isPrivate, token }) =>
    dispatch(
      putOnShelf({ user, gist, cover, title, isFork, isPrivate, token })
    ),
  saveGist: ({
    iframeVersion,
    game,
    token,
    gist,
    sprites,
    map,
    phrases,
    chains,
    songs,
    toBlank
  }) =>
    dispatch(
      saveGist({
        iframeVersion,
        game,
        token,
        gist,
        sprites,
        map,
        phrases,
        chains,
        songs,
        toBlank
      })
    ),
  setNextAction: nextAction => dispatch(actions.setNextAction(nextAction)),
  setScreen: screen => dispatch(actions.setScreen(screen))
})

class Menu extends Component {
  constructor(props) {
    super(props)
    this.keydown = this.keydown.bind(this)
    this.onExport = this.onExport.bind(this)
    this.onRecordClick = this.onRecordClick.bind(this)
    this.onLoginClick = this.onLoginClick.bind(this)
    this.onInsertBlankClick = this.onInsertBlankClick.bind(this)
    this.onPutOnShelfClick = this.onPutOnShelfClick.bind(this)
    this.record = this.record.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onUpdateIframeVersion = this.onUpdateIframeVersion.bind(this)
    window.script8.handleCode = props.fetchToken

    window.addEventListener('beforeunload', this.onClose)
  }

  componentDidUpdate() {
    const { token, nextAction, clearNextAction } = this.props
    if (token.value && nextAction) {
      clearNextAction()
      if (nextAction === 'record') {
        this.record()
      }
      if (nextAction === 'recordtoblank') {
        this.record(true)
      }
    }
  }

  keydown(event) {
    const { screen, game, setCodeTab, setScreen, token } = this.props

    const { altKey, code, metaKey, ctrlKey } = event

    // If we pressed Cmd-S or Ctrl-S,
    if (
      (metaKey && code === 'KeyS' && _.includes(platform, 'Mac')) ||
      (ctrlKey && code === 'KeyS' && !_.includes(platform, 'Mac'))
    ) {
      // and we're logged in,
      // and we can save,
      if (token.value && canRecord(this.props)) {
        // save.
        this.onRecordClick(false)
        event.preventDefault()
      }
    }

    // If we pressed Alt,
    if (altKey) {
      // and we're on the CODE screen,
      if (screen === screenTypes.CODE) {
        // Get the current code tab.
        const codeTab = +getActive(game).key

        // Then see if we pressed [ or ],
        // and if so, cycle through tabs appropriately.
        if (code === 'BracketLeft') {
          setCodeTab((codeTab - 1 + 8) % 8)
          event.preventDefault()
        }
        if (code === 'BracketRight') {
          setCodeTab((codeTab + 1) % 8)
          event.preventDefault()
        }
      }

      if (code === 'Period') {
        setScreen(getPreviousScreen(screen))
        event.preventDefault()
      }
      if (code === 'Slash') {
        setScreen(getNextScreen(screen))
        event.preventDefault()
      }
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.keydown)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onClose)
    window.removeEventListener('keydown', this.keydown)
  }

  onUpdateIframeVersion() {
    if (
      window.confirm(
        'Do you really want to update to the latest SCRIPT-8 API? This change cannot be reverted.'
      )
    ) {
      this.props.updateIframeVersion()
    }
  }

  onExport() {
    const { gist, game } = this.props
    const title = getGameTitle(game).toUpperCase()
    const gistId = _.get(gist, 'data.id', null)

    window
      .fetch(`https://script8.github.io/iframe-v${version}.html`)
      .then(response => response.text())
      .then(text => {
        const html = text
          .replace(
            '<title>script-8-iframe</title>',
            `<title>${title}</title><style>#root canvas.master { width: 100vmin; height: 100vmin; }</style>`
          )
          .replace(
            '<body>',
            `<body><script>window.SCRIPT_8_EMBEDDED_GIST_ID="${gistId}";</script>`
          )
        downloadHtml(html)
      })
  }

  onClose(e) {
    const {
      gist,
      game,
      sprites,
      map,
      phrases,
      chains,
      songs,
      iframeVersion
    } = this.props
    const dirty = isDirty({
      gist,
      game,
      sprites,
      map,
      phrases,
      chains,
      songs,
      iframeVersion
    })
    if (dirty) {
      const message = 'Leave site? Changes you made may not be saved.'
      e.returnValue = message
      return message
    }
  }

  onLoginClick() {
    const { token, clearToken } = this.props
    const loggedIn = !!token.value

    if (loggedIn) {
      clearToken()
    } else {
      window.open(
        `https://github.com/login/oauth/authorize?client_id=${
          process.env.REACT_APP_CLIENT_ID
        }&scope=gist`,
        'popup',
        'width=600,height=700'
      )
    }
  }

  onInsertBlankClick() {
    const {
      gist,
      game,
      sprites,
      map,
      phrases,
      chains,
      songs,
      iframeVersion
    } = this.props

    const dirty = isDirty({
      gist,
      game,
      sprites,
      map,
      phrases,
      chains,
      songs,
      iframeVersion
    })

    if (!dirty || areYouSure()) {
      this.props.newGame(this.props.screen)
    }
  }

  onPutOnShelfClick(isPrivate) {
    const { putOnShelf, gist, game, token } = this.props

    const gistUser = _.get(gist, 'data.owner.login', null)
    const gistId = _.get(gist, 'data.id', null)
    const isFork = !!_.get(gist, 'data.fork_of', null)

    const title = getGameTitle(game)

    const payload = {
      user: gistUser,
      gist: gistId,
      title,
      isFork,
      isPrivate,
      token
    }

    const iframe = document.querySelector('iframe')

    if (iframe) {
      const channel = new window.MessageChannel()
      iframe.contentWindow.postMessage(
        {
          type: 'image'
        },
        '*',
        [channel.port2]
      )
      channel.port1.onmessage = e => {
        const { data } = e
        putOnShelf({
          ...payload,
          cover: data
        })
      }
    } else {
      putOnShelf(payload)
    }
  }

  onRecordClick(toBlank) {
    const { token, setNextAction } = this.props

    if (
      !toBlank ||
      window.confirm('Do you really want to record to a blank cassette?')
    ) {
      // If we're not logged in,
      if (!token.value) {
        // remind ourselves to record next,
        setNextAction(toBlank ? 'recordtoblank' : 'record')

        // and log in.
        window.open(
          `https://github.com/login/oauth/authorize?client_id=${
            process.env.REACT_APP_CLIENT_ID
          }&scope=gist`,
          'popup',
          'width=600,height=700'
        )
      } else {
        // If we are logged in, record.
        this.record(toBlank)
      }
    }
  }

  record(toBlank) {
    const {
      iframeVersion,
      token,
      game,
      saveGist,
      gist,
      sprites,
      map,
      phrases,
      chains,
      songs
    } = this.props
    saveGist({
      iframeVersion,
      token,
      game,
      sprites,
      map,
      phrases,
      chains,
      songs,
      gist,
      toBlank
    })
  }

  render() {
    const {
      screen,
      gist,
      token,
      game,
      sprites,
      map,
      phrases,
      chains,
      songs,
      setScreen,
      sound,
      toggleSound,
      setCodeTab,
      isFetching,
      iframeVersion
    } = this.props

    // If the game isn't equal to the gist,
    // set flag to dirty.
    const dirty = isDirty({
      gist,
      game,
      sprites,
      map,
      phrases,
      chains,
      songs,
      iframeVersion
    })

    const blank = isBlank({ game, sprites, map, phrases, chains, songs })

    const contentIsEmpty =
      _.isEmpty(assembleOrderedGame(game)) &&
      _.isEmpty(sprites) &&
      _.isEmpty(map) &&
      _.isEmpty(phrases) &&
      _.isEmpty(chains) &&
      _.isEmpty(songs)

    // If gistLogin is null, gist was created anonymously.
    const gistLogin = _.get(gist, 'data.owner.login', null)

    // If gistLogin does not match currentLogin, gist wasn't created by us.
    const currentLogin = _.get(token, 'user.login', null)

    // INSERT BLANK can only be enabled when:
    // - the gist is not empty
    // - OR content is not NEW_GAME template
    const enableInsertBlank = !_.isEmpty(gist) || !blank

    const enableRecord = canRecord(this.props)

    // RECORD TO BLANK can only be enabled when:
    // - gist is NOT empty AND
    //    - gist is not ours (anonymous or user that is not us)
    //    - OR there is something to save (content is non-null)
    const enableRecordToBlank =
      !_.isEmpty(gist) &&
      (gistLogin === null || gistLogin !== currentLogin || !contentIsEmpty)

    const isMine = currentLogin && currentLogin === gistLogin

    // SHELVE can only happen when:
    // - gist is ours AND
    // - content is NOT dirty
    const canShelve = isMine && !dirty

    const isMusicScreen = [
      screenTypes.SONG,
      screenTypes.CHAIN,
      screenTypes.PHRASE
    ].includes(screen)

    const isArtScreen = [screenTypes.SPRITE, screenTypes.MAP].includes(screen)

    const codeTab = getActive(game).key
    const codeTabSuffix = screen === screenTypes.CODE ? ` ${codeTab}` : ''

    const loggedIn = !!token.value

    const canUpdateIframeVersion = iframeVersion && iframeVersion !== version

    return (
      <nav className="Menu">
        <ul>
          <li>
            <button
              onClick={() => {
                setScreen(screenTypes.HOME)
              }}
              className={classNames('button', {
                active: screen === screenTypes.HOME
              })}
            >
              <span className="full">SCRIPT-8</span>
              <span className="mid">SCRIPT-8</span>
              <span className="small">
                {screen === screenTypes.HOME ? 'script-8' : 's-8'}
              </span>
            </button>
            <ul className="dropdown">
              <li>
                <button
                  onClick={this.onLoginClick}
                  className="button"
                  disabled={loggedIn}
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  onClick={this.onLoginClick}
                  className="button"
                  disabled={!loggedIn}
                >
                  Logout
                </button>
              </li>
            </ul>
          </li>
          <li>
            <button className="button">
              <span className="full">cassette</span>
              <span className="mid">cas</span>
              <span className="small">ca</span>
              <span className={classNames({ invisible: !dirty })}>*</span>
            </button>
            <ul className="dropdown">
              <li>
                <button
                  onClick={this.onInsertBlankClick}
                  className="button"
                  disabled={!enableInsertBlank}
                >
                  Insert new
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    this.onRecordClick(false)
                  }}
                  className="button"
                  disabled={!enableRecord}
                >
                  Record
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    this.onRecordClick(true)
                  }}
                  className="button"
                  disabled={!enableRecordToBlank}
                >
                  Record to blank
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    this.onPutOnShelfClick(true)
                  }}
                  disabled={!canShelve}
                  className="button"
                >
                  Put on private shelf
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    this.onPutOnShelfClick(false)
                  }}
                  disabled={!canShelve}
                  className="button"
                >
                  Put on public shelf
                </button>
              </li>
              <li>
                {isMine ? (
                  <button
                    onClick={this.onExport}
                    disabled={!canShelve}
                    className="button"
                  >
                    Export to HTML
                  </button>
                ) : null}
              </li>
              <li>
                {canUpdateIframeVersion ? (
                  <button
                    onClick={this.onUpdateIframeVersion}
                    className="button"
                  >
                    UPDATE SCRIPT-8 API
                  </button>
                ) : null}
              </li>
            </ul>
          </li>

          <li>
            <button
              onClick={() => {
                setScreen(screenTypes.CODE)
              }}
              className={classNames('button', {
                active: screen === screenTypes.CODE
              })}
            >
              <span className="full">CODE{codeTabSuffix}</span>
              <span className="mid">
                {screen === screenTypes.CODE
                  ? `code${codeTabSuffix}`
                  : `cod${codeTabSuffix}`}
              </span>
              <span className="small">
                {screen === screenTypes.CODE
                  ? `code${codeTabSuffix}`
                  : `co${codeTabSuffix}`}
              </span>
            </button>
            <ul className="dropdown">
              {_.range(8).map(d => (
                <li key={d}>
                  <button
                    className="button"
                    onClick={() => {
                      setCodeTab(d)
                      setScreen(screenTypes.CODE)
                    }}
                  >
                    CODE {d}
                  </button>
                </li>
              ))}
            </ul>
          </li>

          <li>
            <button
              onClick={() => {
                setScreen(screenTypes.SPRITE)
              }}
              className={classNames('button', {
                active: isArtScreen
              })}
            >
              <span className="full">{isArtScreen ? screen : 'ART'}</span>
              <span className="mid">{isArtScreen ? screen : 'ART'}</span>
              <span className="small">
                {isArtScreen ? screen.substring(0, 2) : 'AR'}
              </span>
            </button>
            <ul className="dropdown">
              <li>
                <button
                  onClick={() => {
                    setScreen(screenTypes.SPRITE)
                  }}
                  className={classNames('button', {
                    active: screen === screenTypes.SPRITE
                  })}
                >
                  SPRITE
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    setScreen(screenTypes.MAP)
                  }}
                  className={classNames('button', {
                    active: screen === screenTypes.MAP
                  })}
                >
                  MAP
                </button>
              </li>
            </ul>
          </li>

          <li>
            <button
              onClick={() => {
                setScreen(screenTypes.PHRASE)
              }}
              className={classNames('button', {
                active: isMusicScreen
              })}
            >
              <span className="full">{isMusicScreen ? screen : 'music'}</span>
              <span className="mid">{isMusicScreen ? screen : 'mus'}</span>
              <span className="small">
                {isMusicScreen ? screen.substring(0, 2) : 'mu'}
              </span>
            </button>
            <ul className="dropdown">
              <li>
                <button
                  onClick={() => {
                    setScreen(screenTypes.PHRASE)
                  }}
                  className={classNames('button', {
                    active: screen === screenTypes.PHRASE
                  })}
                >
                  PHRASE
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    setScreen(screenTypes.CHAIN)
                  }}
                  className={classNames('button', {
                    active: screen === screenTypes.CHAIN
                  })}
                >
                  CHAIN
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    setScreen(screenTypes.SONG)
                  }}
                  className={classNames('button', {
                    active: screen === screenTypes.SONG
                  })}
                >
                  SONG
                </button>
              </li>
            </ul>
          </li>

          <li>
            <button
              onClick={() => {
                setScreen(screenTypes.HELP)
              }}
              className={classNames('button', {
                active: screen === screenTypes.HELP
              })}
            >
              <span className="full">HELP</span>
              <span className="mid">
                {screen === screenTypes.HELP ? 'help' : 'hel'}
              </span>
              <span className="small">
                {screen === screenTypes.HELP ? 'help' : 'he'}
              </span>
            </button>
          </li>

          <li>
            <button
              onClick={() => {
                setScreen(screenTypes.SHELF)
              }}
              className={classNames('button', {
                active: screen === screenTypes.SHELF
              })}
            >
              <span className="full">SHELF</span>
              <span className="mid">
                {screen === screenTypes.SHELF ? 'shelf' : 'she'}
              </span>
              <span className="small">
                {screen === screenTypes.SHELF ? 'shelf' : 'sh'}
              </span>
            </button>
          </li>

          <li>
            <button
              onClick={() => {
                setScreen(screenTypes.RUN)
              }}
              className={classNames('button', {
                active: screen === screenTypes.RUN
              })}
            >
              <span className="full">RUN</span>
              <span className="mid">run</span>
              <span className="small">
                {screen === screenTypes.RUN ? 'run' : 'ru'}
              </span>
            </button>
          </li>

          <li
            className={classNames({
              hide: screen !== screenTypes.RUN
            })}
          >
            <button onClick={toggleSound} className="button">
              <span className="full">{sound ? '' : 'un'}mute</span>
              <span className="mid">{sound ? '' : 'un'}mute</span>
              <span className="small">{sound ? '' : 'un'}mute</span>
            </button>
          </li>
        </ul>
        <ul>
          <li>
            <button
              className={classNames('button', 'title', {
                'is-fetching': isFetching
              })}
            >
              <span>+</span>
            </button>
          </li>
        </ul>
      </nav>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu)
