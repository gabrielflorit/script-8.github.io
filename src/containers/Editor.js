import React from 'react'
import { connect } from 'react-redux'
import Menu from './Menu.js'
import Output from '../components/Output.js'
import NavBar from '../components/NavBar.js'
import Title from '../components/Title.js'
import CodeEditor from '../components/CodeEditor.js'
import Updater from './Updater.js'
import actions from '../actions/actions.js'

const mapStateToProps = ({ screen, gist, game, token }) => ({
  screen,
  gist,
  game,
  token
})

const mapDispatchToProps = (dispatch, props) => ({
  updateGame: game => dispatch(actions.updateGame(game)),
  setScreen: screen => dispatch(actions.setScreen(screen))
})

const Editor = ({ gist, token, screen, game, setScreen, updateGame }) => (
  <div className='Editor'>
    <Updater gist={gist} />
    <Title isFetching={gist.isFetching || token.isFetching} />
    <Menu />
    <NavBar screen={screen} setScreen={setScreen} />
    <CodeEditor game={game} updateGame={updateGame} />
    <Output game={game} />
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
