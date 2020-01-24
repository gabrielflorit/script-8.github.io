import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import * as Tone from 'tone'
import classNames from 'classnames'
import {
  createSynth,
  triggerAttack,
  triggerAttackRelease,
  triggerRelease,
  tempoToPlaybackRate
} from '../iframe/src/soundAPI/index.js'
import actions from '../actions/actions.js'
import TextInput from '../components/TextInput.js'
import toLetter from '../iframe/src/toLetter.js'
import settings from '../iframe/src/settings.js'

const synths = _.range(settings.chainChannels).map(index =>
  createSynth({ index })
)
Tone.Transport.bpm.value = settings.bpm
Tone.Transport.start(settings.startOffset)

const getCurrentPhrase = ({ phrases, selectedUi }) => ({
  tempo: 0,
  synth: 0,
  notes: [],
  ..._.get(phrases, [selectedUi.phrase], {})
})

const mapStateToProps = ({ phrases, selectedUi }) => ({ phrases, selectedUi })

const mapDispatchToProps = dispatch => ({
  selectUi: payload => dispatch(actions.selectUi(payload)),
  updatePhrase: ({ phrase, index }) =>
    dispatch(
      actions.updatePhrase({
        phrase,
        index
      })
    )
})

class Phrase extends Component {
  constructor(props) {
    super(props)

    this.handleCloneChange = this.handleCloneChange.bind(this)
    this.handleClear = this.handleClear.bind(this)
    this.handleClone = this.handleClone.bind(this)
    this.createSequence = this.createSequence.bind(this)
    this.handleTempoChange = this.handleTempoChange.bind(this)
    this.handleSynthChange = this.handleSynthChange.bind(this)
    this.handlePhraseIndexChange = this.handlePhraseIndexChange.bind(this)
    this.handleNoteClick = this.handleNoteClick.bind(this)
    this.handleVolumeClick = this.handleVolumeClick.bind(this)
    this.handlePlay = this.handlePlay.bind(this)
    this.drawCallback = this.drawCallback.bind(this)

    this.state = {
      isPlaying: false,
      playingIndex: 0,
      selectedCloneIndex: '',
      mode: '+'
    }
  }

  handleCloneChange(e) {
    this.setState({
      selectedCloneIndex: e.target.value
    })
  }

  getValidClonePhraseKeys() {
    const { selectedUi, phrases } = this.props
    const phraseIndex = selectedUi.phrase
    return Object.entries(phrases)
      .filter(([key, phrase]) => +key !== +phraseIndex)
      .map(([key, phrase]) => key)
  }

  handleClone() {
    const { selectedUi, phrases, updatePhrase } = this.props
    const validClonePhraseKeys = this.getValidClonePhraseKeys()
    const phraseIndex = selectedUi.phrase
    let { selectedCloneIndex } = this.state
    if (_.isEmpty(selectedCloneIndex)) {
      selectedCloneIndex = validClonePhraseKeys[0]
    }

    if (
      window.confirm(
        `Do you really want to clone phrase ${selectedCloneIndex}?`
      )
    ) {
      updatePhrase({
        phrase: phrases[selectedCloneIndex],
        index: phraseIndex
      })
    }
  }

  handleClear() {
    const { updatePhrase, selectedUi } = this.props
    const phraseIndex = selectedUi.phrase

    if (window.confirm('Do you really want to clear this phrase?')) {
      updatePhrase({
        phrase: {
          tempo: 0,
          synth: 0,
          notes: []
        },
        index: phraseIndex
      })
    }
  }

  drawCallback(playingIndex) {
    this.setState({
      playingIndex
    })
  }

  componentDidMount() {
    Tone.context.resume()

    const phrase = getCurrentPhrase(this.props)
    this.sequence = this.createSequence()
    this.sequence.playbackRate = tempoToPlaybackRate(phrase.tempo)
  }

  createSequence() {
    return new Tone.Sequence(
      (time, index) => {
        const phrase = getCurrentPhrase(this.props)
        const value = phrase.notes[index]
        // If there is a note,
        if (value) {
          // if it's not sustain, triggerAttack.
          if (value.octave > -1) {
            triggerAttack({
              ...value,
              time,
              synth: synths[phrase.synth]
            })
          }
          if (value.octave === -1) {
            // If it's sustain, do nothing.
          }
        } else {
          // If there is no note, triggerRelease.
          triggerRelease({ time, synth: synths[phrase.synth] })
        }
        Tone.Draw.schedule(() => {
          this.drawCallback(index)
        }, time)
      },
      _.range(settings.matrixLength),
      settings.subdivision
    )
  }

  handleSynthChange(e) {
    const { validity, value } = e.target
    if (validity.valid) {
      // Update the store.
      const { updatePhrase, selectedUi } = this.props
      const phraseIndex = selectedUi.phrase
      const phrase = getCurrentPhrase(this.props)
      const newPhrase = {
        ...phrase,
        synth: value
      }

      // Stop the old synth.
      triggerRelease({ synth: synths[phrase.synth] })

      updatePhrase({ phrase: newPhrase, index: phraseIndex })
    }
  }

  handleTempoChange(e) {
    const { validity, value } = e.target
    if (validity.valid) {
      // Update the sequence.
      this.sequence.playbackRate = tempoToPlaybackRate(value)

      // Update the store.
      const { updatePhrase, selectedUi } = this.props
      const phraseIndex = selectedUi.phrase
      const phrase = getCurrentPhrase(this.props)
      const newPhrase = {
        ...phrase,
        tempo: value
      }
      updatePhrase({ phrase: newPhrase, index: phraseIndex })
    }
  }

  handlePlay() {
    const { isPlaying } = this.state
    const phrase = getCurrentPhrase(this.props)
    if (isPlaying) {
      this.sequence.stop()
      triggerRelease({ synth: synths[phrase.synth] })
    } else {
      this.sequence.start(settings.startOffset)
    }
    this.setState({
      isPlaying: !isPlaying,
      playingIndex: 0
    })
  }

  handlePhraseIndexChange(e) {
    const { validity, value } = e.target
    const phrase = getCurrentPhrase(this.props)
    if (validity.valid) {
      const { selectUi, selectedUi } = this.props
      selectUi({
        ...selectedUi,
        phrase: value
      })
      triggerRelease({ synth: synths[phrase.synth] })
    }
  }

  handleVolumeClick(col) {
    const { updatePhrase, selectedUi } = this.props
    const phraseIndex = selectedUi.phrase
    const { isPlaying } = this.state
    const phrase = getCurrentPhrase(this.props)
    const { tempo } = phrase
    const position = phrase.notes[col]
    let newPosition

    // If we do not have a note on this column,
    if (!position) {
      // add one at note 0.
      newPosition = {
        note: 11,
        octave: settings.octaves - 1,
        volume: settings.volumes - 1
      }
    } else {
      const { volume } = position

      // If we do have a note on this column, and we're not at 0,
      if (volume > 0) {
        // decrease it.
        newPosition = {
          ...position,
          volume: volume - 1
        }
      } else {
        // If we are at the max volume,
        // remove the note.
        newPosition = null
      }
    }

    if (newPosition && !isPlaying) {
      // If the note is not sustain, triggerAttackRelease.
      if (newPosition.octave > -1) {
        triggerAttackRelease({
          ...newPosition,
          synth: synths[phrase.synth],
          tempo
        })
      }
    }

    const newPhrase = {
      ...phrase,
      notes: {
        ...phrase.notes,
        [col]: newPosition
      }
    }

    updatePhrase({ phrase: newPhrase, index: phraseIndex })
  }

  handleNoteClick({ row, col }) {
    const { updatePhrase, selectedUi } = this.props
    const phraseIndex = selectedUi.phrase
    const { isPlaying } = this.state
    const phrase = getCurrentPhrase(this.props)
    const { tempo } = phrase
    const position = phrase.notes[col]
    let newNote

    // If we do not have a note on this column,
    if (!position) {
      // add one at the highest octave.
      newNote = {
        note: row,
        octave: settings.octaves - 1,
        volume: settings.volumes - 1
      }
    } else {
      const { note, octave } = position

      // If we do have a note on this column, but not on this row,
      if (note !== row) {
        // update the note to this row, and use the same octave.
        newNote = {
          ...position,
          note: row
        }
      } else {
        // If we have a note on this very column and row,
        // and we're not at -1,
        if (octave > -1) {
          // decrease it.
          newNote = {
            ...position,
            octave: octave - 1
          }
        } else {
          newNote = null
        }
      }
    }

    if (newNote && !isPlaying) {
      // If the note is not sustain, triggerAttackRelease.
      if (newNote.octave > -1) {
        triggerAttackRelease({ ...newNote, synth: synths[phrase.synth], tempo })
      }
    }

    const newPhrase = {
      ...phrase,
      notes: {
        ...phrase.notes,
        [col]: newNote
      }
    }

    updatePhrase({ phrase: newPhrase, index: phraseIndex })
  }

  componentWillUnmount() {
    this.drawCallback = () => {}
    this.sequence.stop()
    const phrase = getCurrentPhrase(this.props)
    triggerRelease({ synth: synths[phrase.synth] })
  }

  componentDidUpdate(prevProps) {
    const oldPhrase = getCurrentPhrase(prevProps)
    const newPhrase = getCurrentPhrase(this.props)
    if (
      prevProps.selectedUi.phrase !== this.props.selectedUi.phrase ||
      oldPhrase.tempo !== newPhrase.tempo
    ) {
      this.sequence.playbackRate = tempoToPlaybackRate(newPhrase.tempo)
    }
  }

  render() {
    const { selectedUi } = this.props
    const phraseIndex = selectedUi.phrase

    const { isPlaying, playingIndex, selectedCloneIndex } = this.state
    const phrase = getCurrentPhrase(this.props)

    const validClonePhraseKeys = this.getValidClonePhraseKeys()

    return (
      <div className="Phrase two-rows-and-grid">
        <div className="main">
          <div className="settings">
            <div className="title">Phrase</div>
            <TextInput
              label="#"
              value={phraseIndex.toString()}
              handleChange={this.handlePhraseIndexChange}
              type="number"
              options={{ min: 0, max: settings.phrases - 1 }}
            />
            <div className="title">Tempo</div>
            <TextInput
              label="#"
              value={phrase.tempo.toString()}
              handleChange={this.handleTempoChange}
              type="number"
              options={{ min: 0, max: 7 }}
            />
            <div className="title">Synth</div>
            <TextInput
              label="#"
              value={phrase.synth.toString()}
              handleChange={this.handleSynthChange}
              type="number"
              options={{ min: 0, max: 3 }}
            />
          </div>
          <div className="matrix">
            <button
              className={classNames('play button', { active: isPlaying })}
              onClick={this.handlePlay}
            >
              {isPlaying ? 'stop' : 'play'}
            </button>
            <table className="notes">
              <tbody>
                {_.range(11, -1).map(row => (
                  <tr key={row}>
                    <td>{toLetter(row)}</td>
                    {_.range(settings.matrixLength).map(col => {
                      const value = phrase.notes[col]
                      const match = value && value.note === row
                      const highlighter =
                        row === 11 && col === playingIndex && isPlaying ? (
                          <span className="highlight" />
                        ) : null
                      return (
                        <td
                          key={col}
                          onClick={() => this.handleNoteClick({ row, col })}
                          className={classNames({
                            match,
                            highlight: col === playingIndex && isPlaying,
                            [`octave-${value && value.octave}`]: match
                          })}
                        >
                          {highlighter}
                          <button>
                            {match
                              ? value.octave > -1
                                ? value.octave
                                : '-'
                              : ' '}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="volumes">
              <tbody>
                <tr>
                  <td>v</td>
                  {_.range(settings.matrixLength).map(col => {
                    const value = phrase.notes[col]
                    const highlighter =
                      col === playingIndex && isPlaying ? (
                        <span className="highlight" />
                      ) : null
                    return (
                      <td
                        key={col}
                        className={classNames({
                          highlight: col === playingIndex && isPlaying,
                          [`volume-${value && value.volume}`]: value
                        })}
                        onClick={() => this.handleVolumeClick(col)}
                      >
                        {highlighter}
                        <button>{value && value.volume}</button>
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="tools">
            <div>
              <button
                className="button"
                disabled={_.isEmpty(phrase.notes)}
                onClick={this.handleClear}
              >
                clear
              </button>
            </div>
            <div className="clone">
              <button
                disabled={_.isEmpty(validClonePhraseKeys)}
                className="button"
                onClick={this.handleClone}
              >
                clone
              </button>
              <select
                value={selectedCloneIndex}
                onChange={this.handleCloneChange}
              >
                {validClonePhraseKeys.map(key => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            {/* <div>
              <button className="button">selected</button>
              <TextInput
                label="#"
                value={phrase.synth.toString()}
                handleChange={this.handleSynthChange}
                type="number"
                options={{ min: 0, max: 3 }}
              />
            </div>
            <div className="add-delete">
              <button
                className={classNames('button', {
                  active: mode === '+'
                })}
                onClick={() => {
                  // this.setMode('+')
                }}
              >
                +
              </button>

              <button
                className={classNames('button', {
                  active: mode === '-'
                })}
                onClick={() => {
                  // this.setMode('-')
                }}
              >
                -
              </button>
            </div> */}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Phrase)
