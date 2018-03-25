import React, { Component } from 'react'
import { connect } from 'react-redux'
import range from 'lodash/range'
import get from 'lodash/get'
import * as Tone from 'tone'
import classNames from 'classnames'
import { createSynth } from '../utils/soundAPI/index.js'
import actions from '../actions/actions.js'
import Updater from './Updater.js'
import Title from './Title.js'
import Menu from './Menu.js'
import NavBar from './NavBar.js'
import TextInput from '../components/TextInput.js'
import toLetter from '../utils/toLetter.js'
import normalize from '../utils/normalize.js'
import settings from '../utils/settings.js'
import defaults from '../utils/defaults.js'

const synths = range(settings.chainChannels).map(() => createSynth())
Tone.Transport.bpm.value = settings.bpm
Tone.Transport.start()

const mapStateToProps = ({ chains, phrases }) => ({ chains, phrases })

const mapDispatchToProps = dispatch => ({
  updateChain: ({ chain, index }) =>
    dispatch(
      actions.updateChain({
        chain,
        index
      })
    )
})

class Chain extends Component {
  constructor (props) {
    super(props)

    this.handleChainIndexChange = this.handleChainIndexChange.bind(this)
    this.handlePhraseKeyPress = this.handlePhraseKeyPress.bind(this)
    this.getCurrentChain = this.getCurrentChain.bind(this)
    this.handlePlay = this.handlePlay.bind(this)

    this.state = {
      isPlaying: false,
      playingIndex: 0,
      chainIndex: 0
    }
  }

  componentDidMount () {
    const { phrases } = this.props
    this.sequence = new Tone.Sequence(
      (time, index) => {
        const chain = this.getCurrentChain()

        const [phrasePosition, notePosition] = [
          '0',
          index.toString(settings.matrixLength)
        ]
          .join('')
          .slice(-2)
          .split('')
          .map(d => parseInt(d, settings.matrixLength))

        // e.g. [000, 001, 003, null] - the phrase indices for this position
        const phrasesIndices = get(chain, [phrasePosition], [])

        // for each channel,
        range(settings.chainChannels).forEach(channel => {
          const phrase = get(phrases, [phrasesIndices[channel]], [])

          const note = get(phrase, ['notes', notePosition], null)
          const volume = get(phrase, ['volumes', notePosition], null)

          if (note !== null && volume > 0) {
            const letter = toLetter(note, true, true)
            synths[channel].triggerAttackRelease(
              letter,
              '32n',
              time,
              normalize.volume(volume)
            )
          }
        })
        Tone.Draw.schedule(() => {
          this.setState({
            playingIndex: phrasePosition
          })
        }, time)
      },
      range(Math.pow(settings.matrixLength, 2)),
      '32n'
    )
  }

  getCurrentChain () {
    const { chains } = this.props
    const { chainIndex } = this.state
    const chain = chains[+chainIndex]
    return chain && chain.length ? chain : defaults.chain
  }

  handlePlay () {
    const { isPlaying } = this.state
    if (isPlaying) {
      this.sequence.stop()
    } else {
      this.sequence.start()
    }
    this.setState({
      isPlaying: !isPlaying,
      playingIndex: 0
    })
  }

  handleChainIndexChange (e) {
    const { validity, value } = e.target
    if (validity.valid) {
      this.setState({
        chainIndex: value
      })
    }
  }

  handlePhraseKeyPress ({ row, col, e }) {
    const { updateChain } = this.props
    const { chainIndex } = this.state
    const { key } = e
    if (!isNaN(key)) {
      const newPhraseIndex = +[e.target.innerText, key].join('').slice(-2)
      if (newPhraseIndex >= 0 && newPhraseIndex < settings.phrases) {
        const chain = this.getCurrentChain()
        const newChain = [
          ...chain.slice(0, col),
          [
            ...chain[col].slice(0, row),
            newPhraseIndex,
            ...chain[col].slice(row + 1)
          ],
          ...chain.slice(col + 1)
        ]
        updateChain({ chain: newChain, index: chainIndex })
      }
    }
    if (key === 'x') {
      const chain = this.getCurrentChain()
      const newChain = [
        ...chain.slice(0, col),
        [...chain[col].slice(0, row), null, ...chain[col].slice(row + 1)],
        ...chain.slice(col + 1)
      ]
      updateChain({ chain: newChain, index: chainIndex })
    }
  }

  componentWillUnmount () {
    this.sequence.stop()
  }

  render () {
    const { chainIndex, isPlaying, playingIndex } = this.state
    const chain = this.getCurrentChain()

    return (
      <div className='Chain'>
        <Updater />
        <Title />
        <Menu />
        <NavBar />
        <div className='main'>
          <div className='settings'>
            <div className='title'>Chain</div>
            <TextInput
              label='#'
              value={chainIndex.toString()}
              handleChange={this.handleChainIndexChange}
              type='number'
              options={{ min: 0, max: settings.chains - 1 }}
            />
          </div>
          <div className='matrix'>
            <button
              className={classNames('play button', { active: isPlaying })}
              onClick={this.handlePlay}
            >
              {isPlaying ? 'stop' : 'play'}
            </button>
            <table className='phrases'>
              <tbody>
                {range(settings.chainChannels).map(row => (
                  <tr key={row}>
                    <td>{row}</td>
                    {chain.map((phrases, col) => {
                      const display =
                        phrases[row] !== null
                          ? ['00', +phrases[row]].join('').slice(-2)
                          : ''
                      return (
                        <td
                          key={col}
                          className={classNames({
                            highlight:
                              col === playingIndex &&
                              isPlaying &&
                              display.length
                          })}
                          onKeyPress={e =>
                            this.handlePhraseKeyPress({ row, col, e })
                          }
                        >
                          <button>
                            <span>{display}</span>
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chain)
