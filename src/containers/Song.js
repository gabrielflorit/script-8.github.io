import React, { Component } from 'react'
import { connect } from 'react-redux'
import range from 'lodash/range'
import get from 'lodash/get'
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
Tone.Transport.bpm.value = 120
Tone.Transport.start()

const mapStateToProps = ({ songs, chains, phrases }) => ({
  songs,
  chains,
  phrases
})

const mapDispatchToProps = dispatch => ({
  updateSong: ({ song, index }) =>
    dispatch(
      actions.updateSong({
        song,
        index
      })
    )
})

class Song extends Component {
  constructor (props) {
    super(props)

    this.handleSongIndexChange = this.handleSongIndexChange.bind(this)
    this.handleChainKeyPress = this.handleChainKeyPress.bind(this)
    this.getCurrentSong = this.getCurrentSong.bind(this)
    this.handlePlay = this.handlePlay.bind(this)
    const { chains, phrases } = this.props

    this.state = {
      isPlaying: false,
      playingIndex: 0,
      songIndex: 0
    }

    this.sequence = new Tone.Sequence(
      (time, index) => {
        const song = this.getCurrentSong()
        const [chainPosition, phrasePosition, notePosition] = [
          '00',
          index.toString(settings.matrixLength)
        ]
          .join('')
          .slice(-3)
          .split('')
          .map(d => parseInt(d, settings.matrixLength))

        // e.g 01 - the chain index for this position
        const chainIndex = get(song, [chainPosition], [])

        // e.g. the chain for this position,
        // an array of an array of phrase indices
        const chain = get(chains, [chainIndex], [])
        const phrasesIndices = get(chain, [phrasePosition], [])

        // for now we'll only deal with ONE channel
        // get the channel 0 phrase for this position
        const phrase = get(phrases, [phrasesIndices[0]], [])

        const note = get(phrase, ['notes', notePosition], null)
        const volume = get(phrase, ['volumes', notePosition], null)

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
            playingIndex: chainPosition
          })
        }, time)
      },
      range(Math.pow(settings.matrixLength, 3)),
      '32n'
    )
  }

  getCurrentSong () {
    const { songs } = this.props
    const { songIndex } = this.state
    const song = songs[+songIndex]
    return song && song.length ? song : defaults.song
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

  handleSongIndexChange (e) {
    const { validity, value } = e.target
    if (validity.valid) {
      this.setState({
        songIndex: value
      })
    }
  }

  handleChainKeyPress ({ col, e }) {
    const { updateSong } = this.props
    const { songIndex } = this.state
    const { key } = e
    if (!isNaN(key)) {
      const newChainIndex = +[e.target.innerText, key].join('').slice(-2)
      if (newChainIndex >= 0 && newChainIndex < settings.chains) {
        const song = this.getCurrentSong()
        const newSong = [
          ...song.slice(0, col),
          newChainIndex,
          ...song.slice(col + 1)
        ]
        updateSong({ song: newSong, index: songIndex })
      }
    }
    if (key === 'x') {
      const song = this.getCurrentSong()
      const newSong = [...song.slice(0, col), null, ...song.slice(col + 1)]
      updateSong({ song: newSong, index: songIndex })
    }
  }

  componentWillUnmount () {
    this.sequence.stop()
  }

  render () {
    const { songIndex, isPlaying, playingIndex } = this.state
    const song = this.getCurrentSong()

    return (
      <div className='Song'>
        <Updater />
        <Title />
        <Menu />
        <NavBar />
        <div className='main'>
          <div className='settings'>
            <div className='title'>Song</div>
            <TextInput
              label='#'
              value={songIndex.toString()}
              handleChange={this.handleSongIndexChange}
              type='number'
              options={{ min: 0, max: settings.songs - 1 }}
            />
          </div>
          <div className='matrix'>
            <button
              className={classNames('play button', { active: isPlaying })}
              onClick={this.handlePlay}
            >
              {isPlaying ? 'stop' : 'play'}
            </button>
            <table className='songs'>
              <tbody>
                <tr>
                  <td>c</td>
                  {song.map((chain, col) => {
                    const display =
                      chain !== null ? ['00', +chain].join('').slice(-2) : ''
                    return (
                      <td
                        key={col}
                        className={classNames({
                          highlight:
                            col === playingIndex && isPlaying && display.length
                        })}
                        onKeyPress={e => this.handleChainKeyPress({ col, e })}
                      >
                        <button>
                          <span>{display}</span>
                        </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Song)
