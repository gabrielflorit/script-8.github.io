import React, { Component } from 'react'
import range from 'lodash/range'
import { connect } from 'react-redux'
import * as Tone from 'tone'
import { createSynth } from '../utils/soundAPI/index.js'
import actions from '../actions/actions.js'
import Updater from './Updater.js'
import Title from './Title.js'
import Menu from './Menu.js'
import NavBar from './NavBar.js'
import Pad from '../components/Pad.js'
import BlocksLabels from '../components/BlocksLabels.js'
import toLetter from '../utils/toLetter.js'
import normalizeVolume from '../utils/normalizeVolume.js'
import settings from '../utils/settings.js'
import defaultSfx from '../utils/defaultSfx.js'

// todo on unmount stop all playing

const volumeColorFormatter = block => (block > 0 ? 4 - Math.ceil(block / 2) : 6)

const synth = createSynth()
Tone.Transport.start(settings.startOffset)

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
    this.getCurrentSfx = this.getCurrentSfx.bind(this)
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

    this.sequence = new Tone.Sequence(
      (time, index) => {
        const sfx = this.getCurrentSfx()
        const note = sfx.notes[index]
        const volume = sfx.volumes[index]
        const letter = toLetter(note, true)
        synth.triggerAttackRelease(letter, '16n', time, normalizeVolume(volume))

        Tone.Draw.schedule(() => {
          this.setState({
            playingIndex: index
          })
        })
      },
      range(16),
      '16n'
    )
  }

  getCurrentSfx () {
    const { sfxs } = this.props
    const { sfxIndex } = this.state
    const sfx = {
      ...defaultSfx,
      ...sfxs[sfxIndex]
    }
    return sfx
  }

  updateNotes ({ block, blockIndex }) {
    const { notes } = this.getCurrentSfx()

    const newNotes = [
      ...notes.slice(0, blockIndex),
      block,
      ...notes.slice(blockIndex + 1)
    ]

    const { updateSfx } = this.props
    const { sfxIndex, isPlaying } = this.state

    if (!isPlaying) {
      const letter = toLetter(block, true)
      synth.triggerAttackRelease(letter, '16n')
    }

    updateSfx({ sfx: { notes: newNotes }, index: sfxIndex })
  }

  updateVolumes ({ block, blockIndex }) {
    const { notes, volumes } = this.getCurrentSfx()

    const newNotes = [
      ...volumes.slice(0, blockIndex),
      block,
      ...volumes.slice(blockIndex + 1)
    ]

    const { updateSfx } = this.props
    const { sfxIndex, isPlaying } = this.state

    if (!isPlaying) {
      const note = notes[blockIndex]
      const letter = toLetter(note, true)
      synth.triggerAttackRelease(
        letter,
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
      this.sequence.stop()
    } else {
      this.sequence.start()
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

  render () {
    const { playingIndex, sfxIndex, isPlaying } = this.state
    const sfx = this.getCurrentSfx()

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
            <BlocksLabels formatter={toLetter} notes={sfx.notes} />
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
