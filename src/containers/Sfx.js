import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../actions/actions.js'
import Updater from './Updater.js'
import Title from './Title.js'
import Menu from './Menu.js'
import NavBar from './NavBar.js'
import NotesPad from '../components/NotesPad.js'

const mapStateToProps = ({ sfx }) => ({ sfx })

const mapDispatchToProps = (dispatch, props) => ({
  updateBars: bars => dispatch(actions.updateSfx({ bars }))
})

class Sfx extends Component {
  constructor (props) {
    super(props)

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.state = { isDown: false }
  }

  handleMouseDown () {
    this.setState({ isDown: true })
  }

  handleMouseUp () {
    this.setState({ isDown: false })
  }

  render () {
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
            updateBars={this.props.updateBars}
            bars={this.props.sfx.bars}
            enabled={this.state.isDown}
          />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sfx)
