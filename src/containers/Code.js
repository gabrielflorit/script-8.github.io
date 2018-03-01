import React from 'react'
import { connect } from 'react-redux'
import Updater from './Updater.js'
import Title from './Title.js'
import Menu from './Menu.js'
import NavBar from './NavBar.js'
import CodeEditor from '../components/CodeEditor.js'
import Output from './Output.js'
import actions from '../actions/actions.js'

const mapStateToProps = ({ game }) => ({
  game
})

const mapDispatchToProps = (dispatch, props) => ({
  updateGame: game => dispatch(actions.updateGame(game))
})

const Code = ({ game, updateGame }) => (
  <div className='Code'>
    <Updater />
    <Title />
    <Menu />
    <NavBar />
    <CodeEditor game={game} updateGame={updateGame} />
    <Output />
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(Code)
