import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import * as Tone from 'tone'
import classNames from 'classnames'
// import { createSynth } from '../utils/soundAPI/index.js'
import actions from '../actions/actions.js'
import Updater from './Updater.js'
import Title from './Title.js'
import Menu from './Menu.js'
import NavBar from './NavBar.js'
import TextInput from '../components/TextInput.js'
// import toLetter from '../utils/toLetter.js'
// import normalize from '../utils/normalize.js'
import settings from '../utils/settings.js'
import defaults from '../utils/defaults.js'

// const synths = _.range(settings.chainChannels).map(() => createSynth())
Tone.Transport.bpm.value = settings.bpm
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
    this.handleChainClick = this.handleChainClick.bind(this)
    this.getCurrentSong = this.getCurrentSong.bind(this)
    this.handlePlay = this.handlePlay.bind(this)
    this.drawCallback = this.drawCallback.bind(this)

    this.state = {
      isPlaying: false,
      playingIndex: 0,
      songIndex: 0
    }
  }

  componentDidMount () {
    // const { chains, phrases } = this.props
    this.sequence = new Tone.Sequence(
      (time, index) => {
        //     const song = this.getCurrentSong()
        //     const [chainPosition, phrasePosition, notePosition] = [
        //       '00',
        //       index.toString(settings.matrixLength)
        //     ]
        //       .join('')
        //       .slice(-3)
        //       .split('')
        //       .map(d => parseInt(d, settings.matrixLength))
        //     // e.g 01 - the chain index for this position
        //     const chainIndex = _.get(song, [chainPosition], [])
        //     // e.g. the chain for this position,
        //     // an array of an array of phrase indices
        //     const chain = _.get(chains, [chainIndex], [])
        //     const phrasesIndices = _.get(chain, [phrasePosition], [])
        //     // for each channel,
        //     _.range(settings.chainChannels).forEach(channel => {
        //       const phrase = _.get(phrases, [phrasesIndices[channel]], [])
        //       const note = _.get(phrase, ['notes', notePosition], null)
        //       const volume = _.get(phrase, ['volumes', notePosition], null)
        //       if (note !== null && volume > 0) {
        //         const letter = toLetter(note, true, true)
        //         synths[channel].triggerAttackRelease(
        //           letter,
        //           '32n',
        //           time,
        //           normalize.volume(volume)
        //         )
        //       }
        //     })
        //     Tone.Draw.schedule(() => {
        //       this.setState({
        //         playingIndex: chainPosition
        //       })
        //     }, time)
      },
      _.range(Math.pow(settings.matrixLength, 3)),
      '32n'
    )
  }

  getCurrentSong () {
    const { songs } = this.props
    const { songIndex } = this.state
    return _.get(songs, songIndex, defaults.song)
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

  handleChainClick ({ col }) {
    const { chains, updateSong } = this.props
    const { songIndex } = this.state
    const song = this.getCurrentSong()
    let newChain = _.get(song, col)

    // Get chains, in order.
    const sortedChains = _(Object.keys(chains))
      .sortBy()
      .uniq()
      .map(d => +d)
      .value()

    // If the cell is empty,
    if (_.isNil(newChain)) {
      // set the last chain.
      newChain = _.last(sortedChains)
    } else {
      // If the cell is not empty,
      // and if it shows the first chain,
      const newChainIndex = _.indexOf(sortedChains, newChain)
      if (newChainIndex === 0) {
        // clear.
        newChain = null
      } else {
        // Otherwise decrease chain.
        newChain = sortedChains[newChainIndex - 1]
      }
    }

    const newSong = {
      ...song,
      [col]: newChain
    }

    updateSong({ song: newSong, index: songIndex })
  }

  drawCallback (playingIndex) {
    this.setState({
      playingIndex
    })
  }

  componentWillUnmount () {
    this.drawCallback = () => {}
    this.sequence.stop()
  }

  render () {
    const { songIndex, isPlaying, playingIndex } = this.state
    const song = this.getCurrentSong()
    const { chains } = this.props

    return (
      <div className='Song'>
        <Updater />
        <Title />
        <Menu />
        <NavBar />
        <div className='main'>
          <div className={classNames('warning', { hide: !_.isEmpty(chains) })}>
            error: no chains found
          </div>
          <div className={classNames('settings', { hide: _.isEmpty(chains) })}>
            <div className='title'>Song</div>
            <TextInput
              label='#'
              value={songIndex.toString()}
              handleChange={this.handleSongIndexChange}
              type='number'
              options={{ min: 0, max: settings.songs - 1 }}
            />
          </div>
          <div className={classNames('matrix', { hide: _.isEmpty(chains) })}>
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
                  {_.range(settings.matrixLength).map(col => {
                    const chain = _.get(song, col)
                    return (
                      <td
                        key={col}
                        className={classNames({
                          highlight:
                            col === playingIndex && isPlaying && !_.isNil(chain)
                        })}
                        onClick={() => this.handleChainClick({ col })}
                      >
                        <button>
                          <span>
                            {_.isNil(chain) ? '' : _.padStart(chain, 2, 0)}
                          </span>
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
