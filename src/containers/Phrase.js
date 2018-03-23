import React, { Component } from 'react'
import { connect } from 'react-redux'
import range from 'lodash/range'
// import * as Tone from 'tone'
// import { createSynth } from '../utils/soundAPI/index.js'
import actions from '../actions/actions.js'
import Updater from './Updater.js'
import Title from './Title.js'
import Menu from './Menu.js'
import NavBar from './NavBar.js'
import TextInput from '../components/TextInput.js'
// import Pad from '../components/Pad.js'
// import BlocksLabels from '../components/BlocksLabels.js'
import toLetter, { numberToOctave } from '../utils/toLetter.js'
// import normalizeVolume from '../utils/normalizeVolume.js'
// import settings from '../utils/settings.js'
import defaults from '../utils/defaults.js'

// todo on unmount stop all playing

// const volumeColorFormatter = block => (block > 0 ? 4 - Math.ceil(block / 2) : 6)

// const synth = createSynth()
// Tone.Transport.start()

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

    // this.updateNotes = this.updateNotes.bind(this)
    // this.updateVolumes = this.updateVolumes.bind(this)
    // this.getCurrentPhrase = this.getCurrentPhrase.bind(this)
    // this.handlePlay = this.handlePlay.bind(this)
    // this.handleSfxClick = this.handleSfxClick.bind(this)
    // this.handleNotesDown = this.handleNotesDown.bind(this)
    // this.handleVolumesDown = this.handleVolumesDown.bind(this)
    // this.handleMouseUp = this.handleMouseUp.bind(this)

    this.state = {
      //   isNotesDown: false,
      //   isVolumesDown: false,
      //   isPlaying: false,
      //   playingIndex: 0,
      phraseIndex: 0
    }

    // this.sequence = new Tone.Sequence(
    //   (time, index) => {
    //     const sfx = this.getCurrentSfx()
    //     const note = sfx.notes[index]
    //     const volume = sfx.volumes[index]
    //     const letter = toLetter(note, true)
    //     synth.triggerAttackRelease(letter, '16n', time, normalizeVolume(volume))

    //     Tone.Draw.schedule(() => {
    //       this.setState({
    //         playingIndex: index
    //       })
    //     })
    //   },
    //   range(16),
    //   '16n'
    // )
  }

  getCurrentPhrase () {
    const { phrases } = this.props
    const { phraseIndex } = this.state
    const phrase = {
      ...defaults.phrase,
      ...phrases[phraseIndex]
    }
    return phrase
  }

  // updateNotes ({ block, blockIndex }) {
  //   const { notes } = this.getCurrentSfx()

  //   const newNotes = [
  //     ...notes.slice(0, blockIndex),
  //     block,
  //     ...notes.slice(blockIndex + 1)
  //   ]

  //   const { updateSfx } = this.props
  //   const { sfxIndex, isPlaying } = this.state

  //   if (!isPlaying) {
  //     const letter = toLetter(block, true)
  //     synth.triggerAttackRelease(letter, '16n')
  //   }

  //   updateSfx({ sfx: { notes: newNotes }, index: sfxIndex })
  // }

  // updateVolumes ({ block, blockIndex }) {
  //   const { notes, volumes } = this.getCurrentSfx()

  //   const newNotes = [
  //     ...volumes.slice(0, blockIndex),
  //     block,
  //     ...volumes.slice(blockIndex + 1)
  //   ]

  //   const { updateSfx } = this.props
  //   const { sfxIndex, isPlaying } = this.state

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

  //   updateSfx({ sfx: { volumes: newNotes }, index: sfxIndex })
  // }

  // handlePlay () {
  //   const { isPlaying } = this.state
  //   if (isPlaying) {
  //     this.sequence.stop()
  //   } else {
  //     this.sequence.start()
  //   }
  //   this.setState({
  //     isPlaying: !isPlaying
  //   })
  // }

  handlePhraseIndexChange (e) {
    const { validity, value } = e.target
    if (validity.valid) {
      this.setState({
        phraseIndex: value
      })
    }
  }

  // handleVolumesDown () {
  //   this.setState({ isVolumesDown: true })
  // }

  // handleNotesDown () {
  //   this.setState({ isNotesDown: true })
  // }

  // handleMouseUp () {
  //   this.setState({
  //     isNotesDown: false,
  //     isVolumesDown: false
  //   })
  // }

  render () {
    const { phraseIndex } = this.state
    // const { playingIndex, sfxIndex, isPlaying } = this.state
    const phrase = this.getCurrentPhrase()
    console.log(phrase)

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
              options={{ min: 0, max: 255 }}
            />
          </div>
          <div className='matrix'>
            <table className='notes'>
              <tbody>
                {range(11, -1).map(row => (
                  <tr key={row}>
                    <td>{toLetter(row)}</td>
                    {phrase.notes.map((col, i) => {
                      const isMatch = col % 12 === row
                      return (
                        <td className={isMatch ? 'match' : ''} key={i}>
                          {isMatch ? numberToOctave(col) : ''}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='instruments'>instr</div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Phrase)
