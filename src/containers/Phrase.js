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

const synth = createSynth()
Tone.Transport.bpm.value = settings.bpm
Tone.Transport.start()

const playNote = ({ note, octave, volume }) => {
  const letter = toLetter(note + octave * 12, true, true)
  synth.triggerAttackRelease(
    letter,
    '32n',
    window.AudioContext.currentTime,
    normalize.volume(volume)
  )
}

const mapStateToProps = ({ phrases }) => ({ phrases })

const mapDispatchToProps = dispatch => ({
  updatePhrase: ({ phrase, index }) =>
    dispatch(
      actions.updatePhrase({
        phrase,
        index
      })
    )
})

class Phrase extends Component {
  constructor (props) {
    super(props)

    this.handlePhraseIndexChange = this.handlePhraseIndexChange.bind(this)
    this.handleNoteClick = this.handleNoteClick.bind(this)
    this.handleVolumeClick = this.handleVolumeClick.bind(this)
    this.getCurrentPhrase = this.getCurrentPhrase.bind(this)
    this.handlePlay = this.handlePlay.bind(this)

    this.state = {
      isPlaying: false,
      playingIndex: 0,
      phraseIndex: 0
    }
  }

  componentDidMount () {
    this.sequence = new Tone.Sequence(
      (time, index) => {
        const phrase = this.getCurrentPhrase()
        const value = phrase[index]
        if (value) {
          const { note, octave, volume } = value
          const letter = toLetter(note + octave * 12, true, true)
          synth.triggerAttackRelease(
            letter,
            '32n',
            time,
            normalize.volume(volume)
          )
        }
        Tone.Draw.schedule(() => {
          this.setState({
            playingIndex: index
          })
        }, time)
      },
      _.range(settings.matrixLength),
      '32n'
    )
  }

  getCurrentPhrase () {
    const { phrases } = this.props
    const { phraseIndex } = this.state
    return _.get(phrases, [+phraseIndex], defaults.phrase)
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

  handlePhraseIndexChange (e) {
    const { validity, value } = e.target
    if (validity.valid) {
      this.setState({
        phraseIndex: value
      })
    }
  }

  handleVolumeClick (col) {
    const { updatePhrase } = this.props
    const { phraseIndex, isPlaying } = this.state
    const phrase = this.getCurrentPhrase()
    const position = phrase[col]
    let newPosition

    // If we do not have a note on this column,
    // add one at note 0.
    if (!position) {
      newPosition = {
        note: 11,
        octave: settings.octaves - 1,
        volume: settings.volumes - 1
      }
    } else {
      const { volume } = position

      // If we do have a note on this column, and we're not at 0,
      // decrease it.
      if (volume > 0) {
        newPosition = {
          ...position,
          volume: volume - 1
        }
      } else {
        // If we are at the max volume, remove the note.
        newPosition = null
      }
    }

    if (newPosition && !isPlaying) {
      playNote(newPosition)
    }

    const newPhrase = {
      ...phrase,
      [col]: newPosition
    }

    updatePhrase({ phrase: newPhrase, index: phraseIndex })
  }

  handleNoteClick ({ row, col }) {
    const { updatePhrase } = this.props
    const { phraseIndex, isPlaying } = this.state
    const phrase = this.getCurrentPhrase()
    const position = phrase[col]
    let newPosition

    // If we do not have a note on this column, add one at octave 0.
    if (!position) {
      newPosition = {
        note: row,
        octave: settings.octaves - 1,
        volume: settings.volumes - 1
      }
    } else {
      const { note, octave } = position

      // If we do have a note on this column, but not on this row,
      // update the note to this row, and use the same octave.
      if (note !== row) {
        newPosition = {
          ...position,
          note: row
        }
      } else {
        // If we have a note on this very column and row,
        // and we're not at 0, decrease it.
        if (octave > 0) {
          newPosition = {
            ...position,
            octave: octave - 1
          }
        } else {
          newPosition = null
        }
      }
    }

    if (newPosition && !isPlaying) {
      playNote(newPosition)
    }

    const newPhrase = {
      ...phrase,
      [col]: newPosition
    }

    updatePhrase({ phrase: newPhrase, index: phraseIndex })
  }

  componentWillUnmount () {
    this.sequence.stop()
  }

  render () {
    const { phraseIndex, isPlaying, playingIndex } = this.state
    const phrase = this.getCurrentPhrase()

    return (
      <div className='Phrase'>
        <Updater />
        <Title />
        <Menu />
        <NavBar />
        <div className='main'>
          <div className='settings'>
            <div className='title'>Phrase</div>
            <TextInput
              label='#'
              value={phraseIndex.toString()}
              handleChange={this.handlePhraseIndexChange}
              type='number'
              options={{ min: 0, max: settings.phrases - 1 }}
            />
          </div>
          <div className='matrix'>
            <button
              className={classNames('play button', { active: isPlaying })}
              onClick={this.handlePlay}
            >
              {isPlaying ? 'stop' : 'play'}
            </button>
            <table className='notes'>
              <tbody>
                {_.range(11, -1).map(row => (
                  <tr key={row}>
                    <td>{toLetter(row)}</td>
                    {_.range(settings.matrixLength).map(col => {
                      const value = phrase[col]
                      const match = value && value.note === row
                      return (
                        <td
                          key={col}
                          onClick={e => this.handleNoteClick({ row, col })}
                          className={classNames({
                            match,
                            highlight: col === playingIndex && isPlaying,
                            [`octave-${value && value.octave}`]: match
                          })}
                        >
                          <button>{match ? value.octave : ' '}</button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <table className='volumes'>
              <tbody>
                <tr>
                  <td>v</td>
                  {_.range(settings.matrixLength).map(col => {
                    const value = phrase[col]
                    return (
                      <td
                        key={col}
                        className={classNames({
                          highlight: col === playingIndex && isPlaying,
                          [`volume-${value && value.volume}`]: value
                        })}
                        onClick={e => this.handleVolumeClick(col)}
                      >
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

export default connect(mapStateToProps, mapDispatchToProps)(Phrase)
