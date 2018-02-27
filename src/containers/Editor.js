import React from 'react'
import { connect } from 'react-redux'
import Output from '../components/Output.js'
import NavBar from '../components/NavBar.js'
import Title from '../components/Title.js'
import Menu from '../components/Menu.js'
import CodeEditor from '../components/CodeEditor.js'
import Updater from '../components/Updater.js'
import actions, { saveGist, fetchToken } from '../actions/actions.js'

const mapStateToProps = ({ screen, gist, game, token, nextAction }) => ({
  screen,
  gist,
  game,
  token,
  nextAction
})

const mapDispatchToProps = (dispatch, props) => ({
  setNextAction: nextAction => dispatch(actions.setNextAction(nextAction)),
  newGame: () => dispatch(actions.newGame()),
  clearNextAction: () => dispatch(actions.clearNextAction()),
  updateGame: game => dispatch(actions.updateGame(game)),
  setScreen: screen => dispatch(actions.setScreen(screen)),
  saveGist: ({ game, token, gist }) =>
    dispatch(saveGist({ game, token, gist })),
  fetchToken: token => dispatch(fetchToken(token))
})

const Editor = ({
  game,
  screen,
  token,
  gist,
  nextAction,
  setScreen,
  updateGame,
  setNextAction,
  clearNextAction,
  fetchToken,
  saveGist,
  newGame
}) => (
  <div className='Editor'>
    <Updater gist={gist} />
    <Title isFetching={gist.isFetching || token.isFetching} />
    <Menu
      game={game}
      gist={gist}
      nextAction={nextAction}
      saveGist={saveGist}
      token={token}
      fetchToken={fetchToken}
      clearNextAction={clearNextAction}
      setNextAction={setNextAction}
      newGame={newGame}
    />
    <NavBar screen={screen} setScreen={setScreen} />
    <CodeEditor game={game} updateGame={updateGame} />
    <Output game={game} />
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
