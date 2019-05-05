import _ from 'lodash'
import classNames from 'classnames'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { tokenizer } from 'acorn'
import actions, { saveGist } from '../actions/actions.js'
import bios from '../iframe/src/utils/bios.js'
import screenTypes, {
  getPreviousScreen,
  getNextScreen
} from '../iframe/src/utils/screenTypes.js'
import canRecord from '../utils/canRecord.js'
import isBlank from '../utils/isBlank.js'
import { getLintErrors } from '../utils/setupLinter.js'
import { numberWithCommas } from '../utils/string.js'
import { assembleOrderedGame } from '../iframe/src/gistParsers/game.js'
import getGameTitle from '../utils/getGameTitle'
import gameLineToTabLine from '../iframe/src/utils/gameLineToTabLine.js'

const mapStateToProps = ({
  iframeVersion,
  screen,
  game,
  songs,
  chains,
  phrases,
  sprites,
  map,
  sound,
  gist,
  token,
  tutorial
}) => ({
  iframeVersion,
  songs,
  chains,
  phrases,
  sprites,
  map,
  game: screen === screenTypes.BOOT ? { 0: { text: bios } } : game,
  run: [screenTypes.BOOT, screenTypes.RUN].includes(screen),
  screen,
  sound,
  gist,
  token,
  tutorial
})

const mapDispatchToProps = dispatch => ({
  setErrorLine: line => dispatch(actions.setErrorLine(line)),
  setCodeTab: tab => dispatch(actions.setCodeTab(tab)),
  setScreen: screen => dispatch(actions.setScreen(screen)),
  finishBoot: () => dispatch(actions.finishBoot()),
  saveGist: ({
    iframeVersion,
    game,
    token,
    gist,
    sprites,
    map,
    phrases,
    chains,
    songs
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
        toBlank: false
      })
    )
})

const getTokenCount = game => {
  const src = assembleOrderedGame(game)
  try {
    return numberWithCommas([...tokenizer(src)].length)
  } catch (error) {
    return 'ERROR'
  }
}
const throttledTokenCount = _.throttle(getTokenCount, 1000)

class Output extends Component {
  constructor(props) {
    super(props)

    this.evaluate = this.evaluate.bind(this)
    this.handleClickSize = this.handleClickSize.bind(this)
    this.handleClickError = this.handleClickError.bind(this)
    this.resize = _.debounce(this.resize.bind(this), 100)
    this.handleBlur = this.handleBlur.bind(this)

    window.addEventListener('resize', this.resize)

    this.state = {
      showSize: false,
      errors: [],
      logs: []
    }
  }

  noop() {}

  resize() {
    if (this.isLoaded) {
      this.evaluate()
    }
  }

  handleClickSize() {
    this.setState({
      showSize: !this.state.showSize
    })
  }

  handleBlur(e) {
    if (this.props.run) {
      e.currentTarget.focus()
    }
  }

  handleClickError({ line, column }) {
    const { game, setCodeTab, setErrorLine } = this.props
    const tabAndTabLine = gameLineToTabLine({
      game,
      gameLine: line
    })
    if (tabAndTabLine) {
      const { tab, tabLine } = tabAndTabLine
      setCodeTab(tab)
      setErrorLine({ line: tabLine - 1, timestamp: Date.now() })
    }
  }

  componentDidMount() {
    this._iframe.focus()
  }

  componentDidUpdate(prevProps) {
    if (this.props.run) {
      this._iframe.focus()
    }
    if (this.isLoaded) {
      if (
        JSON.stringify([
          prevProps.iframeVersion,
          prevProps.game,
          prevProps.finishBoot,
          prevProps.run,
          prevProps.songs,
          prevProps.chains,
          prevProps.phrases,
          prevProps.sprites,
          prevProps.map,
          prevProps.screen,
          prevProps.sound,
          prevProps.gist,
          prevProps.setScreen,
          prevProps.saveGist,
          prevProps.token
        ]) !==
        JSON.stringify([
          this.props.iframeVersion,
          this.props.game,
          this.props.finishBoot,
          this.props.run,
          this.props.songs,
          this.props.chains,
          this.props.phrases,
          this.props.sprites,
          this.props.map,
          this.props.screen,
          this.props.sound,
          this.props.gist,
          this.props.setScreen,
          this.props.saveGist,
          this.props.token
        ])
      ) {
        this.evaluate()
      }
    }
    if (
      assembleOrderedGame(this.props.game) !==
      assembleOrderedGame(prevProps.game)
    ) {
      this.setState({
        logs: []
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  evaluate() {
    const {
      game,
      finishBoot,
      run,
      songs,
      chains,
      phrases,
      sprites,
      map,
      screen,
      sound,
      gist,
      setScreen,
      saveGist,
      token
    } = this.props

    // Create a closured function for eval'ing the game.
    const sendPayload = (callbacks = {}) => {
      const channel = new window.MessageChannel()
      if (this._iframe) {
        const blank = isBlank({ game, sprites, map, phrases, chains, songs })
        const gistIsEmpty = _.isEmpty(gist)
        this._iframe.contentWindow.postMessage(
          {
            type: 'callCode',
            game: assembleOrderedGame(game),
            isDoneFetching:
              screen === screenTypes.BOOT && !gist.isFetching && gist.data,
            songs,
            chains,
            phrases,
            sprites,
            map,
            run,
            callbacks,
            sound,
            isNew: blank && gistIsEmpty
          },
          '*',
          [channel.port2]
        )
        channel.port1.onmessage = e => {
          if (e.data.callback === 'finishBoot') {
            finishBoot()
          }
          const { height, errors, logs, shortcut } = e.data
          if (height && this._iframe) {
            this._iframe.height = height
          }
          if (errors) {
            this.setState({ errors })
          }
          if (!_.isNil(logs)) {
            this.setState({ logs })
          }
          if (shortcut) {
            if (shortcut === 'save') {
              // If we're logged in,
              // and we can save,
              if (token.value && canRecord(this.props)) {
                // save.
                saveGist(this.props)
              }
            }
            if (shortcut === 'previous') {
              setScreen(getPreviousScreen(screen))
            }
            if (shortcut === 'next') {
              setScreen(getNextScreen(screen))
            }
          }
        }
      }
    }

    // If we're on the boot screen,
    // ignore validation.
    if (screen === screenTypes.BOOT) {
      sendPayload({
        endCallback: 'finishBoot'
      })
    } else {
      // Validate code before drawing.
      getLintErrors({
        text: assembleOrderedGame(game)
      }).then(errors => {
        if (!errors.length) {
          sendPayload()
        } else {
          // If we had errors, print them to console.
          console.warn(errors[0].message)
        }
      })
    }
  }

  render() {
    const { errors, logs } = this.state
    const { run, tutorial, game, iframeVersion } = this.props
    const gameTitle = getGameTitle(game)
    document.title = [gameTitle, 'SCRIPT-8'].filter(d => d).join(' - ')

    const tokenCount = throttledTokenCount(game)

    const iframeUrl =
      process.env.NODE_ENV !== 'production'
        ? process.env.REACT_APP_IFRAME_URL
        : `${process.env.REACT_APP_IFRAME_URL}/iframe-v${iframeVersion}.html`

    return (
      <div
        className={classNames('Output', {
          'in-tutorial': tutorial && run
        })}
      >
        <iframe
          src={iframeUrl}
          title="SCRIPT-8"
          sandbox="allow-scripts allow-same-origin"
          onBlur={this.handleBlur}
          ref={_iframe => {
            this._iframe = _iframe
          }}
          onLoad={() => {
            this.isLoaded = true
            this.evaluate()
          }}
        />
        {!run ? (
          <div className="errors-and-stats">
            {logs.map(log => (
              <div className="log">log: {JSON.stringify(log)}</div>
            ))}
            <ul className="errors">
              {errors.map(({ type, data: { message, position } }) =>
                position ? (
                  <li
                    className="clickable"
                    key={type}
                    onClick={() => this.handleClickError(position)}
                  >
                    > error: {message}
                  </li>
                ) : (
                  <li key={type}>error: {message}</li>
                )
              )}
            </ul>

            <div className="stats">TOKENS: {tokenCount}</div>
          </div>
        ) : null}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Output)
