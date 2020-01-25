import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import * as Tone from 'tone'
import classNames from 'classnames'
import {
  createSynth,
  tempoToPlaybackRate,
  triggerRelease,
  triggerAttack
} from '../iframe/src/soundAPI/index.js'
import actions from '../actions/actions.js'
import TextInput from '../components/TextInput.js'
import settings from '../iframe/src/settings.js'

const synths = _.range(settings.chainChannels).map(index =>
  createSynth({ index })
)
Tone.Transport.bpm.value = settings.bpm
Tone.Transport.start(settings.startOffset)

const mapStateToProps = ({ chains, phrases, selectedUi }) => ({
  chains,
  phrases,
  selectedUi
})

const chainIsEmpty = chain =>
  !_.intersection(
    Object.keys(chain),
    _.range(settings.matrixLength).map(i => i.toString())
  ).length

const getCurrentChain = ({ chains, selectedUi }) => ({
  tempo: 0,
  ..._.get(chains, [selectedUi.chain], {})
})

const mapDispatchToProps = dispatch => ({
  selectUi: payload => dispatch(actions.selectUi(payload)),
  updateChain: ({ chain, index }) =>
    dispatch(
      actions.updateChain({
        chain,
        index
      })
    )
})

class Chain extends Component {
  constructor(props) {
    super(props)

    this.keydown = this.keydown.bind(this)
    this.handleClear = this.handleClear.bind(this)
    this.handleSelectedPhraseChange = this.handleSelectedPhraseChange.bind(this)
    this.handleCloneChange = this.handleCloneChange.bind(this)
    this.handleClone = this.handleClone.bind(this)
    this.handleTempoChange = this.handleTempoChange.bind(this)
    this.handleChainIndexChange = this.handleChainIndexChange.bind(this)
    this.handlePhraseClick = this.handlePhraseClick.bind(this)
    this.handlePlay = this.handlePlay.bind(this)
    this.drawCallback = this.drawCallback.bind(this)

    this.state = {
      isPlaying: false,
      playingIndex: 0,
      selectedCloneIndex: '',
      selectedPhraseIndex: '',
      mode: '+'
    }
  }

  handleSelectedPhraseChange(e) {
    this.setState({
      selectedPhraseIndex: e.target.value
    })
    e.currentTarget.blur()
  }

  handleCloneChange(e) {
    this.setState({
      selectedCloneIndex: e.target.value
    })
    e.currentTarget.blur()
  }

  getValidCloneChainKeys() {
    const { selectedUi, chains } = this.props
    const chainIndex = selectedUi.chain
    return Object.keys(chains).filter(key => +key !== +chainIndex)
  }

  handleClone(e) {
    const { selectedUi, chains, updateChain } = this.props
    const validCloneChainKeys = this.getValidCloneChainKeys()
    const chainIndex = selectedUi.chain
    let { selectedCloneIndex } = this.state
    const chain = getCurrentChain(this.props)
    if (_.isEmpty(selectedCloneIndex)) {
      selectedCloneIndex = validCloneChainKeys[0]
    }

    if (
      chainIsEmpty(chain) ||
      window.confirm(
        `Do you really want to clone phrase ${selectedCloneIndex}?`
      )
    ) {
      updateChain({
        chain: chains[selectedCloneIndex],
        index: chainIndex
      })
    }
    e.currentTarget.blur()
  }

  handleClear(e) {
    const { updateChain, selectedUi } = this.props
    const chainIndex = selectedUi.chain

    if (window.confirm('Do you really want to clear this chain?')) {
      updateChain({
        chain: null,
        index: chainIndex
      })
    }
    e.currentTarget.blur()
  }

  drawCallback(playingIndex) {
    this.setState({
      playingIndex
    })
  }

  componentDidMount() {
    Tone.context.resume()

    const { phrases } = this.props
    const chain = getCurrentChain(this.props)

    this.sequence = new Tone.Sequence(
      (time, index) => {
        const chain = getCurrentChain(this.props)

        // Get the phrase and note positions by using base math.
        const [phrasePosition, notePosition] = _.padStart(
          index.toString(settings.matrixLength),
          2,
          0
        )
          .split('')
          .map(d => parseInt(d, settings.matrixLength))

        // Get the phrase indices for this position, e.g. { 0: 0, 1: 11, 2: 2 }
        const phrasesIndices = _.get(chain, phrasePosition)

        // For each channel,
        _.range(settings.chainChannels).forEach(channel => {
          // get the phrase index.
          const phraseIndex = _.get(phrasesIndices, channel)

          // If the phrase index exists,
          if (!_.isNil(phraseIndex)) {
            // get the phrase assigned to this channel.
            const phrase = _.get(phrases, phraseIndex, {})

            // Get the note element for this position.
            const noteElement = _.get(phrase.notes, notePosition)

            // If we have a note:
            if (!_.isNil(noteElement)) {
              // if we have a non-sustain note, triggerAttack.
              if (noteElement.octave > -1) {
                triggerAttack({
                  ...noteElement,
                  time,
                  synth: synths[channel]
                })
              }
              // If we have a sustain, do nothing.
              if (noteElement.octave === -1) {
              }
            } else {
              // If we don't have a note, triggerRelease.
              triggerRelease({ time, synth: synths[channel] })
            }
          } else {
            // If the phrase doesn't exist, stop the synth.
            triggerRelease({ time, synth: synths[channel] })
          }
        })
        Tone.Draw.schedule(() => {
          this.drawCallback(phrasePosition)
        }, time)
      },
      _.range(Math.pow(settings.matrixLength, 2)),
      settings.subdivision
    )

    this.sequence.playbackRate = tempoToPlaybackRate(chain.tempo)
    window.addEventListener('keydown', this.keydown)
  }

  keydown(event) {
    // If we pressed space,
    if (event.code === 'Space') {
      // toggle the playbar.
      this.handlePlay(event)
    }
  }

  handleTempoChange(e) {
    const { validity, value } = e.target
    if (validity.valid) {
      // Update the sequence.
      this.sequence.playbackRate = tempoToPlaybackRate(value)

      // Update the store.
      const { updateChain, selectedUi } = this.props
      const chain = getCurrentChain(this.props)
      const newChain = _.cloneDeep(chain)
      newChain.tempo = value
      const chainIndex = selectedUi.chain
      updateChain({ chain: newChain, index: chainIndex })
    }
  }

  handlePlay(e) {
    const { isPlaying } = this.state
    if (isPlaying) {
      this.sequence.stop()
      synths.forEach(synth => triggerRelease({ synth }))
    } else {
      this.sequence.start(settings.startOffset)
    }
    this.setState({
      isPlaying: !isPlaying,
      playingIndex: 0
    })
    e.currentTarget.blur()
  }

  handleChainIndexChange(e) {
    const { validity, value } = e.target
    if (validity.valid) {
      const { selectUi, selectedUi } = this.props
      selectUi({
        ...selectedUi,
        chain: value
      })
    }
  }

  handlePhraseClick({ channel, col, e }) {
    const { phrases, updateChain, selectedUi } = this.props
    const { selectedPhraseIndex, mode } = this.state
    const chainIndex = selectedUi.chain
    const chain = getCurrentChain(this.props)
    const newChain = _.cloneDeep(chain)
    let newPhrase = _.get(newChain, [col, channel])

    // Get all phrases, in order.
    const allPhrases = _(Object.keys(phrases))
      .sortBy(d => +d)
      .uniq()
      .map(d => +d)
      .value()

    if (mode === '-') {
      newPhrase = null
    } else {
      // If the cell is empty,
      if (_.isNil(newPhrase)) {
        // add the selected one.
        newPhrase = _.isEmpty(selectedPhraseIndex)
          ? allPhrases[0]
          : selectedPhraseIndex
      } else {
        // If the cell is not empty,
        // get the phrase index.
        const newPhraseIndex = _.indexOf(allPhrases, +newPhrase)

        // If it shows the first overall phrase,
        if (newPhraseIndex === 0) {
          // clear the cell.
          newPhrase = null
        } else {
          // Else decrease phrase.
          newPhrase = allPhrases[newPhraseIndex - 1]
        }
      }
    }

    _.setWith(newChain, [col, channel], newPhrase, Object)
    updateChain({ chain: newChain, index: chainIndex })
    e.currentTarget.blur()
  }

  componentWillUnmount() {
    this.drawCallback = () => {}
    this.sequence.stop()
    synths.forEach(synth => triggerRelease({ synth }))
    window.removeEventListener('keydown', this.keydown)
  }

  componentDidUpdate(prevProps) {
    const oldChain = getCurrentChain(prevProps)
    const newChain = getCurrentChain(this.props)
    if (
      prevProps.selectedUi.chain !== this.props.selectedUi.chain ||
      oldChain.tempo !== newChain.tempo
    ) {
      this.sequence.playbackRate = tempoToPlaybackRate(newChain.tempo)
    }

    if (!chainIsEmpty(oldChain) && chainIsEmpty(newChain)) {
      this.setState({ mode: '+' })
    }
  }

  render() {
    const { selectedUi, phrases } = this.props
    const chainIndex = selectedUi.chain

    const {
      isPlaying,
      playingIndex,
      selectedCloneIndex,
      selectedPhraseIndex,
      mode
    } = this.state
    const chain = getCurrentChain(this.props)
    const validCloneChainKeys = this.getValidCloneChainKeys()

    return (
      <div className="Chain two-rows-and-grid">
        <div className="main">
          <div className={classNames('warning', { hide: !_.isEmpty(phrases) })}>
            error: no phrases found
          </div>
          <div className={classNames('settings', { hide: _.isEmpty(phrases) })}>
            <div className="title">Chain</div>
            <TextInput
              label="#"
              value={chainIndex.toString()}
              handleChange={this.handleChainIndexChange}
              type="number"
              options={{ min: 0, max: settings.chains - 1 }}
            />
            <div className="title">Tempo</div>
            <TextInput
              label="#"
              value={chain.tempo.toString()}
              handleChange={this.handleTempoChange}
              type="number"
              options={{ min: 0, max: 7 }}
            />
          </div>
          <div className={classNames('matrix', { hide: _.isEmpty(phrases) })}>
            <button
              className={classNames('play button', { active: isPlaying })}
              onClick={this.handlePlay}
            >
              {isPlaying ? 'stop' : 'play'}
            </button>
            <table className="phrases">
              <tbody>
                {_.range(settings.chainChannels).map(channel => (
                  <tr key={channel}>
                    <td>{channel}</td>
                    {_.range(settings.matrixLength).map(col => {
                      const phrase = _.get(chain, [col, channel])
                      const highlighter =
                        channel === 0 && col === playingIndex && isPlaying ? (
                          <span className="highlight" />
                        ) : null
                      return (
                        <td
                          key={col}
                          className={classNames({
                            highlight:
                              col === playingIndex &&
                              isPlaying &&
                              !_.isNil(phrase)
                          })}
                          onClick={e =>
                            this.handlePhraseClick({ channel, col, e })
                          }
                        >
                          {highlighter}
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
          <div className="tools">
            <div>
              <button
                className="button"
                disabled={chainIsEmpty(chain)}
                onClick={this.handleClear}
              >
                clear
              </button>
            </div>
            <div className="clone">
              <button
                disabled={_.isEmpty(validCloneChainKeys)}
                className="button"
                onClick={this.handleClone}
              >
                clone
              </button>
              <select
                value={selectedCloneIndex}
                onChange={this.handleCloneChange}
              >
                {validCloneChainKeys.map(key => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            <div className="selected">
              <span className="title">phrase</span>
              <select
                value={selectedPhraseIndex}
                onChange={this.handleSelectedPhraseChange}
              >
                {Object.keys(phrases).map(key => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            <div className="add-delete">
              <button
                className={classNames('button', {
                  active: mode === '+'
                })}
                onClick={() => {
                  this.setState({
                    mode: '+'
                  })
                }}
              >
                +
              </button>
              <button
                // disabled={_.isEmpty(phrase.notes)}
                className={classNames('button', {
                  active: mode === '-'
                })}
                onClick={() => {
                  this.setState({
                    mode: '-'
                  })
                }}
              >
                -
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chain)
