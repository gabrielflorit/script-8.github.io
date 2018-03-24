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
Tone.Transport.start()

const mapStateToProps = ({ chains }) => ({ chains })

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
    // this.handleNoteClick = this.handleNoteClick.bind(this)
    // this.handleNoteKeyPress = this.handleNoteKeyPress.bind(this)
    // this.handleVolumeKeyPress = this.handleVolumeKeyPress.bind(this)
    this.getCurrentChain = this.getCurrentChain.bind(this)
    this.handlePlay = this.handlePlay.bind(this)

    this.state = {
      // isPlaying: false,
      playingIndex: 0,
      chainIndex: 0
      // octave: 0
    }

    // this.sequence = new Tone.Sequence(
    //   (time, index) => {
    //     const chain = this.getCurrentChain()
    //     const note = chain.notes[index]
    //     const volume = chain.volumes[index]
    //     if (note !== null && volume > 0) {
    //       const letter = toLetter(note, true, true)
    //       synth.triggerAttackRelease(
    //         letter,
    //         '32n',
    //         time,
    //         normalize.volume(volume)
    //       )
    //     }
    //     Tone.Draw.schedule(() => {
    //       this.setState({
    //         playingIndex: index
    //       })
    //     })
    //   },
    //   range(settings.matrixLength),
    //   '32n'
    // )
  }

  getCurrentChain () {
    const { chains } = this.props
    const { chainIndex } = this.state
    const chain = chains[chainIndex]
    return chain && chain.length ? chain : defaults.chain
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
    // if (isPlaying) {
    //   this.sequence.stop()
    // } else {
    //   this.sequence.start()
    // }
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

  // handleVolumeKeyPress ({ col, e }) {
  //   const { updateChain } = this.props
  //   const { chainIndex } = this.state
  //   const { key } = e
  //   if (includes(range(settings.volumes).map(d => d.toString()), key)) {
  //     const { volumes } = this.getCurrentChain()
  //     const newVolumes = [
  //       ...volumes.slice(0, col),
  //       +key,
  //       ...volumes.slice(col + 1)
  //     ]

  // const newNotes =
  //   +key === 0
  //     ? [...notes.slice(0, col), null, ...notes.slice(col + 1)]
  //     : [...notes]

  // updateChain({
  //   phrase: { volumes: newVolumes },
  //   index: chainIndex
  // })
  // }
  // }

  // handleNoteKeyPress ({ note, col, e }) {
  //   const { updateChain } = this.props
  //   const { chainIndex } = this.state
  //   const { notes } = this.getCurrentChain()
  //   const { key } = e
  //   if (includes(range(settings.octaves).map(d => d.toString()), key)) {
  //     const newNotes = [
  //       ...notes.slice(0, col),
  //       note + +key * 12,
  //       ...notes.slice(col + 1)
  //     ]

  // updateChain({ phrase: { notes: newNotes }, index: chainIndex })
  // this.setState({
  //   octave: +key
  // })
  // }
  // }

  // handleNoteClick ({ note, col, e }) {
  //   const { updateChain } = this.props
  //   const { chainIndex, octave } = this.state
  //   const { notes } = this.getCurrentChain()

  //   const newNotes = [
  //     ...notes.slice(0, col),
  //     e.currentTarget.classList.contains('match') ? null : note + octave * 12,
  //     ...notes.slice(col + 1)
  //   ]

  //   updateChain({ phrase: { notes: newNotes }, index: chainIndex })
  // }

  // componentWillUnmount () {
  //   this.sequence.stop()
  // }

  render () {
    const { chainIndex, isPlaying } = this.state
    // const { chainIndex, isPlaying, playingIndex } = this.state
    const chain = this.getCurrentChain()

    console.log(chain)
    return (
      <div className='Chain'>
        <Updater />
        <Title />
        <Menu />
        <NavBar />
        <div className='main'>
          <div className='settings'>
            <div className='title'>Chain</div>
            <TextInput
              label='#'
              value={chainIndex.toString()}
              handleChange={this.handleChainIndexChange}
              type='number'
              options={{ min: 0, max: settings.chains - 1 }}
            />
          </div>
          <div className='matrix'>
            <button
              className={classNames('play button', { active: isPlaying })}
              onClick={this.handlePlay}
            >
              {isPlaying ? 'stop' : 'play'}
            </button>
            <table className='phrases'>
              <tbody>
                {range(4).map(row => (
                  <tr key={row}>
                    <td>{row}</td>
                    {chain.map((phrases, col) => {
                      return (
                        <td key={col}>
                          <button>
                            <span>{phrases[row]}</span>
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
