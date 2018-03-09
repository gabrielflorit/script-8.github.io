import React, { Component } from 'react'
import range from 'lodash/range'
import { connect } from 'react-redux'
import actions from '../actions/actions.js'
import Updater from './Updater.js'
import Title from './Title.js'
import Menu from './Menu.js'
import NavBar from './NavBar.js'
import Pad from '../components/Pad.js'
import NotesInputs from '../components/NotesInputs.js'
import numberToNote from '../utils/numberToNote.js'

const mapStateToProps = ({ sfxs }) => ({ sfxs })

const mapDispatchToProps = dispatch => ({
  updateVolumes: ({ blocks, index }) =>
    dispatch(
      actions.updateSfx({
        sfx: {
          volumes: blocks
        },
        index
      })
    ),
  updateNotes: ({ blocks, index }) =>
    dispatch(
      actions.updateSfx({
        sfx: {
          notes: blocks
        },
        index
      })
    )
})

class Sfx extends Component {
  constructor (props) {
    super(props)

    this.handleSfxClick = this.handleSfxClick.bind(this)
    this.handleNotesDown = this.handleNotesDown.bind(this)
    this.handleVolumesDown = this.handleVolumesDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.state = {
      isNotesDown: false,
      isVolumesDown: false,
      sfxIndex: 0
    }
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
    const { sfxIndex } = this.state
    let sfx = this.props.sfxs[sfxIndex] || {}
    sfx = {
      notes: sfx.notes || range(16).map(d => 0),
      volumes: sfx.volumes || range(16).map(d => 0)
    }

    const volumeColorFormatter = block => (block > 0 ? 4 - block : 6)

    return (
      <div className='Sfx' onMouseUp={this.handleMouseUp}>
        <Updater />
        <Title />
        <Menu />
        <NavBar />
        <div className='wrapper'>
          <div className='title'>sfx</div>
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
          <div className='title'>notes</div>
          <div className='pad-wrapper' onMouseDown={this.handleNotesDown}>
            <Pad
              drawLines
              enabled={this.state.isNotesDown}
              updateBlocks={this.props.updateNotes}
              blocks={sfx.notes}
              index={sfxIndex}
              totalBlocks={37}
            />
            <NotesInputs formatter={numberToNote} notes={sfx.notes} />
          </div>
          <div className='title'>vol</div>
          <div className='pad-wrapper' onMouseDown={this.handleVolumesDown}>
            <Pad
              colorFormatter={volumeColorFormatter}
              enabled={this.state.isVolumesDown}
              updateBlocks={this.props.updateVolumes}
              blocks={sfx.volumes}
              index={this.state.sfxIndex}
              totalBlocks={4}
            />
            <NotesInputs notes={sfx.volumes} />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sfx)
