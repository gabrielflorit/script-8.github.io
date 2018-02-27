import React from 'react'
import { connect } from 'react-redux'
import Menu from './Menu.js'
import Output from './Output.js'
import Title from './Title.js'
import NavBar from '../components/NavBar.js'
import CodeEditor from '../components/CodeEditor.js'
import Updater from './Updater.js'
import actions from '../actions/actions.js'

const mapStateToProps = ({ game }) => ({
  game
})

const mapDispatchToProps = (dispatch, props) => ({
  updateGame: game => dispatch(actions.updateGame(game))
})

const Editor = ({ game, updateGame }) => (
  <div className='Editor'>
    <Updater />
    <Title />
    <Menu />
    <NavBar />
    <CodeEditor game={game} updateGame={updateGame} />
    <Output />
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
