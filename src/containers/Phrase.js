import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import * as Tone from 'tone'
import classNames from 'classnames'
import {
  createSynth,
  playNote,
  tempoToPlaybackRate
} from '../iframe/src/soundAPI/index.js'
import actions from '../actions/actions.js'
import TextInput from '../components/TextInput.js'
import toLetter from '../iframe/src/toLetter.js'
import settings from '../iframe/src/settings.js'

const synth = createSynth()
Tone.Transport.bpm.value = settings.bpm
Tone.Transport.start(settings.startOffset)

const getCurrentPhrase = ({ phrases, selectedUi }) => ({
  tempo: 0,
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

    this.createSequence = this.createSequence.bind(this)
    this.handleTempoChange = this.handleTempoChange.bind(this)
    this.handlePhraseIndexChange = this.handlePhraseIndexChange.bind(this)
    this.handleNoteClick = this.handleNoteClick.bind(this)
    this.handleVolumeClick = this.handleVolumeClick.bind(this)
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

    const phrase = getCurrentPhrase(this.props)
    this.sequence = this.createSequence()
    this.sequence.playbackRate = tempoToPlaybackRate(phrase.tempo)
  }

  createSequence() {
    return new Tone.Sequence(
      (time, index) => {
        const phrase = getCurrentPhrase(this.props)
        const value = phrase.notes[index]
        if (value) {
          playNote({ ...value, time, synth, tempo: phrase.tempo })
        }
        Tone.Draw.schedule(() => {
          this.drawCallback(index)
        }, time)
      },
      _.range(settings.matrixLength),
      settings.subdivision
    )
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

  handlePhraseIndexChange(e) {
    const { validity, value } = e.target
    if (validity.valid) {
      const { selectUi, selectedUi } = this.props
      selectUi({
        ...selectedUi,
        phrase: value
      })
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
      playNote({ ...newPosition, synth, tempo })
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
        // and we're not at 0,
        if (octave > 0) {
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
      playNote({ ...newNote, synth, tempo })
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

    const { isPlaying, playingIndex } = this.state
    const phrase = getCurrentPhrase(this.props)

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
                          <button>{match ? value.octave : ' '}</button>
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
                        onClick={e => this.handleVolumeClick(col)}
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
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Phrase)
