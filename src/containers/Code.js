import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import CodeEditor from '../components/CodeEditor.js'
import actions from '../actions/actions.js'

const mapStateToProps = ({ game, tutorial }) => ({
  game,
  tutorial
})

const mapDispatchToProps = dispatch => ({
  updateGame: game => dispatch(actions.updateGame(game))
})

class Code extends Component {
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
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Code)
