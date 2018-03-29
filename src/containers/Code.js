import React from 'react'
import { connect } from 'react-redux'
import CodeEditor from '../components/CodeEditor.js'
import TopBar from '../components/TopBar.js'
import Output from './Output.js'
import actions from '../actions/actions.js'

const mapStateToProps = ({ game }) => ({
  game
})

const mapDispatchToProps = (dispatch, props) => ({
  updateGame: game => dispatch(actions.updateGame(game))
})

const Code = ({ game, updateGame }) => (
  <div className='Code two-rows two-rows-and-grid'>
    <TopBar />
    <div className='main'>
      <CodeEditor game={game} updateGame={updateGame} />
      <Output />
    </div>
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(Code)
