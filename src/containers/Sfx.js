import React, { Component } from 'react'
import range from 'lodash/range'
import { connect } from 'react-redux'
import * as Tone from 'tone'
import actions from '../actions/actions.js'
import Updater from './Updater.js'
import Title from './Title.js'
import Menu from './Menu.js'
import NavBar from './NavBar.js'
import Pad from '../components/Pad.js'
import BlocksLabels from '../components/BlocksLabels.js'
import { numberToNote, numberToOctave } from '../utils/numberToNote.js'
import settings from '../utils/settings.js'

const normalizeVolume = vol => vol / settings.volumes
const volumeColorFormatter = block => (block > 0 ? 4 - Math.ceil(block / 2) : 6)

const pulseOptions = {
  oscillator: {
    type: 'triangle'
  },
  envelope: {
    attack: 0.1,
    decay: 0.1,
    sustain: 0.1,
    release: 0.1
  }
}

const synth = new Tone.Synth(pulseOptions).toMaster()
Tone.Transport.start()

const mapStateToProps = ({ sfxs }) => ({ sfxs })

const mapDispatchToProps = dispatch => ({
  updateSfx: ({ sfx, index }) =>
    dispatch(
      actions.updateSfx({
        sfx,
        index
      })
    )
})

class Sfx extends Component {
  constructor (props) {
    super(props)

    this.updateNotes = this.updateNotes.bind(this)
    this.updateVolumes = this.updateVolumes.bind(this)
    // TODO refactor this so it's not functional
    this.getSfx = this.getSfx.bind(this)
    this.handlePlay = this.handlePlay.bind(this)
    this.handleSfxClick = this.handleSfxClick.bind(this)
    this.handleNotesDown = this.handleNotesDown.bind(this)
    this.handleVolumesDown = this.handleVolumesDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.state = {
      isNotesDown: false,
      isVolumesDown: false,
      isPlaying: false,
      playingIndex: 0,
      sfxIndex: 0
    }

    this.loop = new Tone.Sequence(
      (time, noteIndex) => {
        const { sfxs } = this.props
        const { sfxIndex } = this.state
        const sfx = this.getSfx({ sfxIndex, sfxs })
        const noteNumber = sfx.notes[noteIndex]
        const volume = sfx.volumes[noteIndex]
        const note = numberToNote(noteNumber)
        const octave = numberToOctave(noteNumber)
        synth.triggerAttackRelease(
          `${note}${octave}`,
          '16n',
          time,
          normalizeVolume(volume)
        )
        this.setState({
          playingIndex: noteIndex
        })
      },
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      '16n'
    )
  }

  updateNotes ({ block, blockIndex }) {
    const { sfxs, updateSfx } = this.props
    const { sfxIndex, isPlaying } = this.state
    const sfx = this.getSfx({ sfxIndex, sfxs })
    const { notes } = sfx

    const note = numberToNote(block)

    const newNotes = [
      ...notes.slice(0, blockIndex),
      block,
      ...notes.slice(blockIndex + 1)
    ]

    if (!isPlaying) {
      const octave = numberToOctave(block)
      synth.triggerAttackRelease(`${note}${octave}`, '16n')
    }

    updateSfx({ sfx: { notes: newNotes }, index: sfxIndex })
  }

  updateVolumes ({ block, blockIndex }) {
    const { sfxs, updateSfx } = this.props
    const { sfxIndex, isPlaying } = this.state
    const sfx = this.getSfx({ sfxIndex, sfxs })
    const { notes, volumes } = sfx

    const noteNumber = notes[blockIndex]

    const newNotes = [
      ...volumes.slice(0, blockIndex),
      block,
      ...volumes.slice(blockIndex + 1)
    ]

    if (!isPlaying) {
      const octave = numberToOctave(noteNumber)
      synth.triggerAttackRelease(
        `${numberToNote(noteNumber)}${octave}`,
        '16n',
        window.AudioContext.currentTime,
        normalizeVolume(block)
      )
    }

    updateSfx({ sfx: { volumes: newNotes }, index: sfxIndex })
  }

  handlePlay () {
    const { isPlaying } = this.state
    if (isPlaying) {
      this.loop.stop()
    } else {
      this.loop.start()
    }
    this.setState({
      isPlaying: !isPlaying
    })
  }

  handleSfxClick (e) {
    this.setState({
      sfxIndex: +e.target.textContent - 1
    })
  }

  handleVolumesDown () {
    this.setState({ isVolumesDown: true })
  }

  handleNotesDown () {
    this.setState({ isNotesDown: true })
  }

  handleMouseUp () {
    this.setState({
      isNotesDown: false,
      isVolumesDown: false
    })
  }

  getSfx ({ sfxs, sfxIndex }) {
    let sfx = sfxs[sfxIndex] || {}
    sfx = {
      notes: sfx.notes || range(16).map(d => 0),
      volumes: sfx.volumes || range(16).map(d => settings.volumes)
    }
    return sfx
  }

  render () {
    const { sfxs } = this.props
    const { playingIndex, sfxIndex, isPlaying } = this.state
    const sfx = this.getSfx({ sfxIndex, sfxs })

    return (
      <div className='Sfx' onMouseUp={this.handleMouseUp}>
        <Updater />
        <Title />
        <Menu />
        <NavBar />
        <div className='wrapper'>
          <div className='controls'>
            <button onClick={this.handlePlay}>
              {isPlaying ? 'stop' : 'play'}
            </button>
          </div>
          <div className='title'>#</div>
          <ul className='sfx-buttons'>
            {range(8).map(i => (
              <li key={i}>
                <button
                  onClick={this.handleSfxClick}
                  className={i === sfxIndex ? 'active' : ''}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
          <div />
          <ul className='highlighter'>
            {range(16).map(i => (
              <li
                className={playingIndex === i && isPlaying ? 'active' : ''}
                key={i}
              />
            ))}
          </ul>
          <div className='title'>notes</div>
          <div className='pad-wrapper' onMouseDown={this.handleNotesDown}>
            <Pad
              drawLines
              enabled={this.state.isNotesDown}
              updateBlock={this.updateNotes}
              blocks={sfx.notes}
              totalBlocks={settings.octaves * 12}
            />
            <BlocksLabels formatter={numberToNote} notes={sfx.notes} />
          </div>
          <div className='title'>vol</div>
          <div className='pad-wrapper' onMouseDown={this.handleVolumesDown}>
            <Pad
              enabled={this.state.isVolumesDown}
              updateBlock={this.updateVolumes}
              blocks={sfx.volumes}
              totalBlocks={settings.volumes}
              colorFormatter={volumeColorFormatter}
            />
            <BlocksLabels notes={sfx.volumes} />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sfx)
