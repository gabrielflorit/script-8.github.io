import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
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

const synths = _.range(settings.chainChannels).map(() => createSynth())
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
    this.handlePhraseClick = this.handlePhraseClick.bind(this)
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
        // const chain = this.getCurrentChain()
        // const [phrasePosition, notePosition] = [
        //   '0',
        //   index.toString(settings.matrixLength)
        // ]
        //   .join('')
        //   .slice(-2)
        //   .split('')
        //   .map(d => parseInt(d, settings.matrixLength))
        // // e.g. [000, 001, 003, null] - the phrase indices for this position
        // const phrasesIndices = _.get(chain, [phrasePosition], [])
        // // for each channel,
        // _.range(settings.chainChannels).forEach(channel => {
        //   const phrase = _.get(phrases, [phrasesIndices[channel]], [])
        //   const note = _.get(phrase, ['notes', notePosition], null)
        //   const volume = _.get(phrase, ['volumes', notePosition], null)
        //   if (note !== null && volume > 0) {
        //     const letter = toLetter(note, true, true)
        //     synths[channel].triggerAttackRelease(
        //       letter,
        //       '32n',
        //       time,
        //       normalize.volume(volume)
        //     )
        //   }
        // })
        // Tone.Draw.schedule(() => {
        //   this.setState({
        //     playingIndex: phrasePosition
        //   })
        // }, time)
      },
      _.range(Math.pow(settings.matrixLength, 2)),
      '32n'
    )
  }

  getCurrentChain () {
    const { chains } = this.props
    const { chainIndex } = this.state
    return _.get(chains, chainIndex, defaults.chain)
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

  handlePhraseClick ({ channel, col }) {
    const { phrases, updateChain } = this.props
    const { chainIndex } = this.state
    const chain = this.getCurrentChain()
    const newChain = _.cloneDeep(chain)
    let newPhrase = _.get(newChain, [col, channel])

    // Get all phrases, in order.
    const allPhrases = _(Object.keys(phrases))
      .sortBy()
      .uniq()
      .map(d => +d)
      .value()

    // If the cell is empty,
    if (_.isNil(newPhrase)) {
      // add the last overall phrase.
      newPhrase = _.last(allPhrases)
    } else {
      // If the cell is not empty,

      const newPhraseIndex = _.indexOf(allPhrases, newPhrase)
      // If it shows the first overall phrase,
      if (newPhraseIndex === 0) {
        // clear the cell.
        newPhrase = null
      } else {
        // Else decrease phrase.
        newPhrase = allPhrases[newPhraseIndex - 1]
      }
    }

    _.setWith(newChain, [col, channel], newPhrase, Object)

    updateChain({ chain: newChain, index: chainIndex })
  }

  componentWillUnmount () {
    this.sequence.stop()
  }

  render () {
    const { chainIndex, isPlaying, playingIndex } = this.state
    const chain = this.getCurrentChain()
    const { phrases } = this.props

    return (
      <div className='Chain'>
        <Updater />
        <Title />
        <Menu />
        <NavBar />
        <div className='main'>
          <div className={classNames('warning', { hide: !_.isEmpty(phrases) })}>
            error: no phrases found
          </div>
          <div className={classNames('settings', { hide: _.isEmpty(phrases) })}>
            <div className='title'>Chain</div>
            <TextInput
              label='#'
              value={chainIndex.toString()}
              handleChange={this.handleChainIndexChange}
              type='number'
              options={{ min: 0, max: settings.chains - 1 }}
            />
          </div>
          <div className={classNames('matrix', { hide: _.isEmpty(phrases) })}>
            <button
              className={classNames('play button', { active: isPlaying })}
              onClick={this.handlePlay}
            >
              {isPlaying ? 'stop' : 'play'}
            </button>
            <table className='phrases'>
              <tbody>
                {_.range(settings.chainChannels).map(channel => (
                  <tr key={channel}>
                    <td>{channel}</td>
                    {_.range(settings.matrixLength).map(col => {
                      const phrase = _.get(chain, [col, channel])
                      return (
                        <td
                          key={col}
                          className={classNames({
                            highlight:
                              col === playingIndex &&
                              isPlaying &&
                              !_.isNil(phrase)
                          })}
                          onClick={() =>
                            this.handlePhraseClick({ channel, col })
                          }
                        >
                          <button>
                            <span>
                              {_.isNil(phrase) ? '' : _.padStart(phrase, 2, 0)}
                            </span>
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
