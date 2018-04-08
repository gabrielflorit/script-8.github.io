import React, { Component } from 'react'
import { connect } from 'react-redux'
import CodeEditor from '../components/CodeEditor.js'
import TopBar from '../components/TopBar.js'
import Output from './Output.js'
import actions from '../actions/actions.js'

const mapStateToProps = ({ game }) => ({
  game
})

const mapDispatchToProps = dispatch => ({
  isNewUser: () => dispatch(actions.isNewUser()),
  updateGame: game => dispatch(actions.updateGame(game))
})

class Code extends Component {
  componentDidMount () {
    // If this is a new user, fire NEW_USER
    this.props.isNewUser()
  }

  render () {
    const { game, updateGame } = this.props

    return (
      <div className='Code two-rows two-rows-and-grid'>
        <TopBar />
        <div className='main'>
          <CodeEditor game={game} updateGame={updateGame} />
          <Output />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Code)
