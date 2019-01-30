import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import _ from 'lodash'
import screenTypes from '../utils/screenTypes.js'
import isDirty from '../utils/isDirty.js'
import isBlank from '../utils/isBlank.js'
import areYouSure from '../utils/areYouSure.js'
import actions, {
  saveGist,
  fetchToken,
  putOnShelf
} from '../actions/actions.js'

const mapStateToProps = ({
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
  toggleSound: () => dispatch(actions.toggleSound()),
  clearNextAction: () => dispatch(actions.clearNextAction()),
  fetchToken: token => dispatch(fetchToken(token)),
  newGame: screen => dispatch(actions.newGame(screen)),
  putOnShelf: ({ user, gist, cover, title }) =>
    dispatch(putOnShelf({ user, gist, cover, title })),
  saveGist: ({
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
  constructor (props) {
    super(props)
    this.onRecordClick = this.onRecordClick.bind(this)
    this.onInsertBlankClick = this.onInsertBlankClick.bind(this)
    this.onPutOnShelfClick = this.onPutOnShelfClick.bind(this)
    this.record = this.record.bind(this)
    this.onClose = this.onClose.bind(this)
    window.script8.handleCode = props.fetchToken

    window.addEventListener('beforeunload', this.onClose)
  }

  componentDidUpdate () {
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

  componentWillUnmount () {
    window.removeEventListener('beforeunload', this.onClose)
  }

  onClose (e) {
    const { gist, game, sprites, map, phrases, chains, songs } = this.props
    const dirty = isDirty({
      gist,
      game,
      sprites,
      map,
      phrases,
      chains,
      songs
    })
    if (dirty) {
      const message = 'Leave site? Changes you made may not be saved.'
      e.returnValue = message
      return message
    }
  }

  onInsertBlankClick () {
    const { gist, game, sprites, map, phrases, chains, songs } = this.props

    const dirty = isDirty({
      gist,
      game,
      sprites,
      map,
      phrases,
      chains,
      songs
    })

    if (!dirty || areYouSure()) {
      this.props.newGame(this.props.screen)
    }
  }

  onPutOnShelfClick () {
    const { putOnShelf, gist, game } = this.props

    const gistUser = _.get(gist, 'data.owner.login', null)
    const gistId = _.get(gist, 'data.id', null)

    let title
    const match = game.split('\n')[0].match(/\/\/\s*title:\s*(\S.*)/)
    if (match) {
      title = match[1].trim()
    }

    const payload = { user: gistUser, gist: gistId, title }

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

  onRecordClick (toBlank) {
    const { token, setNextAction } = this.props

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

  record (toBlank) {
    const {
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

  render () {
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
      isFetching
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
      songs
    })
    const blank = isBlank({ game, sprites, map, phrases, chains, songs })

    const contentIsEmpty =
      _.isEmpty(game) &&
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

    // RECORD can only be enabled when:
    // - the gist is ours AND content is dirty
    // - OR the gist is empty (new game)
    const enableRecord =
      (currentLogin && currentLogin === gistLogin && dirty) || _.isEmpty(gist)

    // RECORD TO BLANK can only be enabled when:
    // - gist is NOT empty AND
    //    - gist is not ours (anonymous or user that is not us)
    //    - OR there is something to save (content is non-null)
    const enableRecordToBlank =
      !_.isEmpty(gist) &&
      (gistLogin === null || gistLogin !== currentLogin || !contentIsEmpty)

    // SHELVE can only happen when:
    // - gist is ours AND
    // - content is NOT dirty
    const canShelve = currentLogin && currentLogin === gistLogin && !dirty

    const isMusicScreen = [
      screenTypes.SONG,
      screenTypes.CHAIN,
      screenTypes.PHRASE
    ].includes(screen)

    const isArtScreen = [screenTypes.SPRITE, screenTypes.MAP].includes(screen)

    return (
      <nav className='Menu'>
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
              <span className='full'>SCRIPT-8</span>
              <span className='mid'>SCRIPT-8</span>
              <span className='small'>
                {screen === screenTypes.HOME ? 'script-8' : 's-8'}
              </span>
            </button>
          </li>
          <li>
            <button className='button'>
              <span className='full'>cassette</span>
              <span className='mid'>cas</span>
              <span className='small'>ca</span>
              <span className={classNames({ invisible: !dirty })}>*</span>
            </button>
            <ul className='dropdown'>
              <li>
                <button
                  onClick={this.onInsertBlankClick}
                  className='button'
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
                  className='button'
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
                  className='button'
                  disabled={!enableRecordToBlank}
                >
                  Record to blank
                </button>
              </li>

              <li>
                <button
                  onClick={this.onPutOnShelfClick}
                  disabled={!canShelve}
                  className='button'
                >
                  Put on shelf
                </button>
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
              <span className='full'>CODE</span>
              <span className='mid'>
                {screen === screenTypes.CODE ? 'code' : 'cod'}
              </span>
              <span className='small'>
                {screen === screenTypes.CODE ? 'code' : 'co'}
              </span>
            </button>
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
              <span className='full'>ART</span>
              <span className='mid'>ART</span>
              <span className='small'>{isArtScreen ? 'art' : 'ar'}</span>
            </button>
            <ul className='dropdown'>
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
              <span className='full'>MUSIC</span>
              <span className='mid'>{isMusicScreen ? 'music' : 'mus'}</span>
              <span className='small'>{isMusicScreen ? 'music' : 'mu'}</span>
            </button>
            <ul className='dropdown'>
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
                setScreen(screenTypes.RUN)
              }}
              className={classNames('button', {
                active: screen === screenTypes.RUN
              })}
            >
              <span className='full'>RUN</span>
              <span className='mid'>run</span>
              <span className='small'>
                {screen === screenTypes.RUN ? 'run' : 'ru'}
              </span>
            </button>
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
              <span className='full'>HELP</span>
              <span className='mid'>
                {screen === screenTypes.HELP ? 'help' : 'hel'}
              </span>
              <span className='small'>
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
              <span className='full'>SHELF</span>
              <span className='mid'>
                {screen === screenTypes.SHELF ? 'shelf' : 'she'}
              </span>
              <span className='small'>
                {screen === screenTypes.SHELF ? 'shelf' : 'sh'}
              </span>
            </button>
          </li>

          <li
            className={classNames({
              hide: screen !== screenTypes.RUN
            })}
          >
            <button onClick={toggleSound} className='button'>
              <span className='full'>sound-{sound ? 'OFF' : 'ON'}</span>
              <span className='mid'>sound-{sound ? 'OFF' : 'ON'}</span>
              <span className='small'>sound-{sound ? 'OFF' : 'ON'}</span>
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
