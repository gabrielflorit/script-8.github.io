import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import equal from 'deep-equal'
import _ from 'lodash'
import screenTypes from '../utils/screenTypes.js'
import blankGame from '../utils/blank.js'
import actions, { saveGist, fetchToken } from '../actions/actions.js'
import Title from './Title.js'

import { parseGistGame } from '../reducers/game.js'
import { extractGistSprites } from '../reducers/sprites.js'
import { extractGistPhrases } from '../reducers/phrases.js'
import { extractGistChains } from '../reducers/chains.js'
import { extractGistSongs } from '../reducers/songs.js'

const mapStateToProps = ({
  gist,
  game,
  sprites,
  phrases,
  chains,
  songs,
  token,
  screen,
  nextAction
}) => ({
  screen,
  gist,
  game,
  sprites,
  phrases,
  chains,
  songs,
  token,
  nextAction
})

const mapDispatchToProps = dispatch => ({
  clearNextAction: () => dispatch(actions.clearNextAction()),
  fetchToken: token => dispatch(fetchToken(token)),
  newGame: screen => dispatch(actions.newGame(screen)),
  saveGist: ({ game, token, gist, sprites, phrases, chains, songs, toBlank }) =>
    dispatch(
      saveGist({ game, token, gist, sprites, phrases, chains, songs, toBlank })
    ),
  setNextAction: nextAction => dispatch(actions.setNextAction(nextAction)),
  setScreen: screen => dispatch(actions.setScreen(screen))
})

class Menu extends Component {
  constructor (props) {
    super(props)
    this.onRecordClick = this.onRecordClick.bind(this)
    this.onInsertBlankClick = this.onInsertBlankClick.bind(this)
    this.record = this.record.bind(this)
    window.script8.handleCode = props.fetchToken
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

  onInsertBlankClick () {
    this.props.newGame(this.props.screen)
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
      phrases,
      chains,
      songs
    } = this.props
    saveGist({ token, game, sprites, phrases, chains, songs, gist, toBlank })
  }

  render () {
    const {
      screen,
      gist,
      token,
      game,
      sprites,
      phrases,
      chains,
      songs,
      setScreen
    } = this.props

    // If the game isn't equal to the gist,
    // set flag to dirty.
    const gistGame = parseGistGame(gist.data)
    const gistSprites = extractGistSprites(gist.data)
    const gistPhrases = extractGistPhrases(gist.data)
    const gistChains = extractGistChains(gist.data)
    const gistSongs = extractGistSongs(gist.data)
    const dirtyGame = !equal(gistGame, game)
    const dirtySprites = !equal(gistSprites, sprites)
    const dirtyPhrases = !equal(gistPhrases, phrases)
    const dirtyChains = !equal(gistChains, chains)
    const dirtySongs = !equal(gistSongs, songs)
    const dirty =
      dirtyGame || dirtyPhrases || dirtyChains || dirtySongs || dirtySprites

    const contentIsEmpty =
      _.isEmpty(game) &&
      _.isEmpty(sprites) &&
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
    const enableInsertBlank =
      !_.isEmpty(gist) ||
      !(
        game === blankGame &&
        _.isEmpty(sprites) &&
        _.isEmpty(phrases) &&
        _.isEmpty(chains) &&
        _.isEmpty(songs)
      )

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

    return (
      <nav className='Menu'>
        <Title />
        <ul>
          <li>
            <button className='button'>
              Cassette
              <span className={classNames({ invisible: !dirty })}>*</span>
            </button>
            <ul className='dropdown'>
              <li>
                <button
                  onClick={this.onInsertBlankClick}
                  className='button'
                  disabled={!enableInsertBlank}
                >
                  Insert blank
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
              CODE
            </button>
          </li>

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
              className={classNames('button', {
                active: [
                  screenTypes.SONG,
                  screenTypes.CHAIN,
                  screenTypes.PHRASE
                ].includes(screen)
              })}
            >
              SOUND
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
              RUN
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
              HELP
            </button>
          </li>
        </ul>
      </nav>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
