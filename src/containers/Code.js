import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import CodeEditor from '../components/CodeEditor.js'
import Output from './Output.js'
import actions from '../actions/actions.js'

const mapStateToProps = ({ game, newUser, tutorial }) => ({
  game,
  newUser,
  tutorial
})

const mapDispatchToProps = dispatch => ({
  // isNewUser: () => dispatch(actions.isNewUser()),
  updateGame: game => dispatch(actions.updateGame(game))
})

class Code extends Component {
  componentDidMount () {
    // const { newUser, isNewUser } = this.props
    // if (newUser === null) {
    //   isNewUser()
    // }
  }

  render () {
    const { game, updateGame, tutorial } = this.props

    return (
      <div
        className={classNames('Code two-rows-and-grid', {
          tutorial: tutorial !== false
        })}
      >
        <div className='main'>
          <CodeEditor game={game} updateGame={updateGame} />
          <Output />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Code)
