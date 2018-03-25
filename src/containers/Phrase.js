import React, { Component } from 'react'
import { connect } from 'react-redux'
import range from 'lodash/range'
import includes from 'lodash/includes'
import * as Tone from 'tone'
import classNames from 'classnames'
import { createSynth } from '../utils/soundAPI/index.js'
import actions from '../actions/actions.js'
import Updater from './Updater.js'
import Title from './Title.js'
import Menu from './Menu.js'
import NavBar from './NavBar.js'
import TextInput from '../components/TextInput.js'
import toLetter, { numberToOctave } from '../utils/toLetter.js'
import normalize from '../utils/normalize.js'
import settings from '../utils/settings.js'
import defaults from '../utils/defaults.js'

const synth = createSynth()
Tone.Transport.bpm.value = settings.bpm
Tone.Transport.start()

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
    this.handleNoteKeyPress = this.handleNoteKeyPress.bind(this)
    this.handleVolumeKeyPress = this.handleVolumeKeyPress.bind(this)
    this.getCurrentPhrase = this.getCurrentPhrase.bind(this)
    this.handlePlay = this.handlePlay.bind(this)

    this.state = {
      isPlaying: false,
      playingIndex: 0,
      phraseIndex: 0,
      octave: 0
    }
  }

  componentDidMount () {
    this.sequence = new Tone.Sequence(
      (time, index) => {
        const phrase = this.getCurrentPhrase()
        const note = phrase.notes[index]
        const volume = phrase.volumes[index]
        if (note !== null && volume > 0) {
          const letter = toLetter(note, true, true)
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
      range(settings.matrixLength),
      '32n'
    )
  }

  getCurrentPhrase () {
    const { phrases } = this.props
    const { phraseIndex } = this.state
    const phrase = {
      ...defaults.phrase,
      ...phrases[+phraseIndex]
    }
    return phrase
  }

  // updateNotes ({ block, blockIndex }) {
  //   if (!isPlaying) {
  //     const letter = toLetter(block, true)
  //     synth.triggerAttackRelease(letter, '16n')
  //   }
  // }
  //   if (!isPlaying) {
  //     const note = notes[blockIndex]
  //     const letter = toLetter(note, true)
  //     synth.triggerAttackRelease(
  //       letter,
  //       '16n',
  //       window.AudioContext.currentTime,
  //       normalizeVolume(block)
  //     )
  //   }

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

  handleVolumeKeyPress ({ col, e }) {
    const { updatePhrase } = this.props
    const { phraseIndex } = this.state
    const { key } = e
    if (includes(range(settings.volumes).map(d => d.toString()), key)) {
      const { volumes } = this.getCurrentPhrase()
      const newVolumes = [
        ...volumes.slice(0, col),
        +key,
        ...volumes.slice(col + 1)
      ]

      updatePhrase({
        phrase: { volumes: newVolumes },
        index: phraseIndex
      })
    }
  }

  handleNoteKeyPress ({ note, col, e }) {
    const { updatePhrase } = this.props
    const { phraseIndex } = this.state
    const { notes } = this.getCurrentPhrase()
    const { key } = e
    if (includes(range(settings.octaves).map(d => d.toString()), key)) {
      const newNotes = [
        ...notes.slice(0, col),
        note + +key * 12,
        ...notes.slice(col + 1)
      ]

      updatePhrase({ phrase: { notes: newNotes }, index: phraseIndex })
      this.setState({
        octave: +key
      })
    }
  }

  handleNoteClick ({ note, col, e }) {
    const { updatePhrase } = this.props
    const { phraseIndex, octave } = this.state
    const { notes } = this.getCurrentPhrase()

    const newNotes = [
      ...notes.slice(0, col),
      e.currentTarget.classList.contains('match') ? null : note + octave * 12,
      ...notes.slice(col + 1)
    ]

    updatePhrase({ phrase: { notes: newNotes }, index: phraseIndex })
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
                {range(11, -1).map(row => (
                  <tr key={row}>
                    <td>{toLetter(row)}</td>
                    {phrase.notes.map((note, col) => {
                      const isMatch = note !== null && note % 12 === row
                      return (
                        <td
                          key={col}
                          className={classNames(
                            {
                              match: isMatch,
                              highlight: col === playingIndex && isPlaying
                            },
                            `octave-${numberToOctave(note)}`
                          )}
                          onClick={e =>
                            this.handleNoteClick({ note: row, col, e })
                          }
                          onKeyPress={e =>
                            this.handleNoteKeyPress({ note: row, col, e })
                          }
                        >
                          <button>
                            {isMatch ? numberToOctave(note) : ' '}
                          </button>
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
                  {phrase.volumes.map((vol, col) => {
                    return (
                      <td
                        key={col}
                        className={classNames(
                          {
                            highlight: col === playingIndex && isPlaying
                          },
                          `volume-${vol}`
                        )}
                        onKeyPress={e => this.handleVolumeKeyPress({ col, e })}
                      >
                        <button>{vol}</button>
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          </div>
          <div className='instruments' />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Phrase)
