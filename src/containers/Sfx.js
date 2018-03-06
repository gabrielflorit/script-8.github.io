import React, { Component } from 'react'
import range from 'lodash/range'
import { connect } from 'react-redux'
import actions from '../actions/actions.js'
import Updater from './Updater.js'
import Title from './Title.js'
import Menu from './Menu.js'
import NavBar from './NavBar.js'
import NotesPad from '../components/NotesPad.js'

const mapStateToProps = ({ sfxs }) => ({ sfxs })

const mapDispatchToProps = dispatch => ({
  updateNotes: ({ notes, index }) =>
    dispatch(actions.updateSfx({ sfx: notes, index }))
})

class Sfx extends Component {
  constructor (props) {
    super(props)

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.state = { isDown: false, sfxIndex: 0 }
  }

  handleMouseDown () {
    this.setState({ isDown: true })
  }

  handleMouseUp () {
    this.setState({ isDown: false })
  }

  render () {
    const notes =
      this.props.sfxs[this.state.sfxIndex] ||
      range(NotesPad.cols).map(d => ({
        note: 0,
        volume: 1
      }))
    return (
      <div
        className='Sfx'
        onMouseUp={this.handleMouseUp}
        onMouseDown={this.handleMouseDown}
      >
        <Updater />
        <Title />
        <Menu />
        <NavBar />
        <div className='wrapper'>
          <NotesPad
            enabled={this.state.isDown}
            updateNotes={this.props.updateNotes}
            notes={notes}
            index={this.state.sfxIndex}
          />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sfx)
