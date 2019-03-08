import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import * as Tone from 'tone'
import classNames from 'classnames'
import { createSynth, playNote } from '../iframe/src/soundAPI/index.js'
import actions from '../actions/actions.js'
import TextInput from '../components/TextInput.js'
import settings from '../iframe/src/settings.js'

const synths = _.range(settings.chainChannels).map(() => createSynth())
Tone.Transport.bpm.value = settings.bpm
Tone.Transport.start(settings.startOffset)

const mapStateToProps = ({ chains, phrases, selectedUi }) => ({
  chains,
  phrases,
  selectedUi
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

    this.handleChainIndexChange = this.handleChainIndexChange.bind(this)
    this.handlePhraseClick = this.handlePhraseClick.bind(this)
    this.getCurrentChain = this.getCurrentChain.bind(this)
    this.handlePlay = this.handlePlay.bind(this)
    this.drawCallback = this.drawCallback.bind(this)

    this.state = {
      isPlaying: false,
      playingIndex: 0
    }
  }

  drawCallback(playingIndex) {
    this.setState({
      playingIndex
    })
  }

  componentDidMount() {
    Tone.context.resume()

    const { phrases } = this.props

    this.sequence = new Tone.Sequence(
      (time, index) => {
        const chain = this.getCurrentChain()

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

            // If we have a note,
            if (!_.isNil(noteElement)) {
              // play it!
              playNote({
                ...noteElement,
                time,
                synth: synths[channel],
                tempo: 0
              })
            }
          }
        })
        Tone.Draw.schedule(() => {
          this.drawCallback(phrasePosition)
        }, time)
      },
      _.range(Math.pow(settings.matrixLength, 2)),
      settings.subdivision
    )
  }

  getCurrentChain() {
    const { chains, selectedUi } = this.props
    return _.get(chains, [selectedUi.chain], {})
  }

  handlePlay() {
    const { isPlaying } = this.state
    if (isPlaying) {
      this.sequence.stop()
    } else {
      this.sequence.start(settings.startOffset)
    }
    this.setState({
      isPlaying: !isPlaying,
      playingIndex: 0
    })
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

  handlePhraseClick({ channel, col }) {
    const { phrases, updateChain, selectedUi } = this.props
    const chainIndex = selectedUi.chain
    const chain = this.getCurrentChain()
    const newChain = _.cloneDeep(chain)
    let newPhrase = _.get(newChain, [col, channel])

    // Get all phrases, in order.
    const allPhrases = _(Object.keys(phrases))
      .sortBy(d => +d)
      .uniq()
      .map(d => +d)
      .value()

    // If the cell is empty,
    if (_.isNil(newPhrase)) {
      // add the last overall phrase.
      newPhrase = _.last(allPhrases)
    } else {
      // If the cell is not empty,
      // get the phrase index.
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

  componentWillUnmount() {
    this.drawCallback = () => {}
    this.sequence.stop()
  }

  render() {
    const { selectedUi } = this.props
    const chainIndex = selectedUi.chain
    const { isPlaying, playingIndex } = this.state
    const chain = this.getCurrentChain()
    const { phrases } = this.props

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
                          onClick={() =>
                            this.handlePhraseClick({ channel, col })
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
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chain)
