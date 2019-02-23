import _ from 'lodash'
import classNames from 'classnames'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { tokenizer } from "acorn";
import actions from '../actions/actions.js'
import bios from '../utils/bios.js'
import screenTypes from '../utils/screenTypes.js'
import isBlank from '../utils/isBlank.js'
import { getLintErrors } from '../utils/setupLinter.js'
import { numberWithCommas } from '../utils/string.js'
import { assembleOrderedGame } from '../reducers/game.js'

const mapStateToProps = ({
  screen,
  game,
  songs,
  chains,
  phrases,
  sprites,
  map,
  sound,
  gist,
  tutorial
}) => ({
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
  tutorial
})

const mapDispatchToProps = dispatch => ({
  finishBoot: () => dispatch(actions.finishBoot())
})

const getTokenCount = src => {
  try {
    return numberWithCommas([...tokenizer(src)].length)
  } catch (error) {
    return "ERROR"
  }
}

class Output extends Component {
  constructor(props) {
    super(props)

    this.evaluate = this.evaluate.bind(this)
    this.getSize = this.getSize.bind(this)
    this.handleClickSize = this.handleClickSize.bind(this)
    this.resize = _.debounce(this.resize.bind(this), 100)
    this.handleBlur = this.handleBlur.bind(this)

    window.addEventListener('resize', this.resize)

    this.state = {
      showSize: false,
      errors: []
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

  componentDidMount() {
    this._iframe.focus()
  }

  componentDidUpdate() {
    if (this.props.run) {
      this._iframe.focus()
    }
    if (this.isLoaded) {
      this.evaluate()
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
      gist
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
          const { height, errors } = e.data
          if (height && this._iframe) {
            this._iframe.height = height
          }
          if (errors) {
            this.setState({ errors })
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

  getSize() {
    const { game, songs, chains, phrases, sprites, map } = this.props

    const code = assembleOrderedGame(game)
    const art = JSON.stringify({ sprites, map })
    const music = JSON.stringify({ phrases, chains, songs })
    const total = code + art + music

    const assets = {
      code,
      art,
      music,
      total
    };

    return (
      <ul>
        {_.toPairs(assets).map(pair => ((name, code) => (
          <li key={name}>
            {name}: {getTokenCount(code)}
          </li>
        ))(...pair))}
      </ul>
    )
  }

  render() {
    const { showSize, errors } = this.state
    const { run, tutorial } = this.props

    return (
      <div
        className={classNames('Output', {
          'in-tutorial': tutorial && run
        })}
      >
        <iframe
          src={process.env.REACT_APP_IFRAME_URL}
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
            <ul className="errors">
              {errors.map(({ type, message }) => (
                <li key={type}>error: {message}</li>
              ))}
            </ul>
            <div className="stats">
              {showSize ? this.getSize() : null}
              <button className="button" onClick={this.handleClickSize}>
                {showSize ? 'hide' : 'show'} cassette size
              </button>
            </div>
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
