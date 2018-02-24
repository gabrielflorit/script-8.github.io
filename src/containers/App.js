import React from 'react'
import { connect } from 'react-redux'
import Boot from '../components/Boot.js'
import Run from '../components/Run.js'
import Editor from '../components/Editor.js'
import actions, { fetchGist, fetchToken } from '../actions/actions.js'
import screenTypes from '../utils/screenTypes.js'
import '../css/App.css'

const mapStateToProps = ({ screen, gist, booted, game, token }) => ({
  screen,
  gist,
  booted,
  game,
  token
})

const mapDispatchToProps = (dispatch, props) => ({
  setNextAction: nextAction => dispatch(actions.setNextAction(nextAction)),
  updateGame: game => dispatch(actions.updateGame(game)),
  setScreen: screen => dispatch(actions.setScreen(screen)),
  finishBoot: () => dispatch(actions.finishBoot()),
  fetchGist: id => dispatch(fetchGist(id)),
  fetchToken: token => dispatch(fetchToken(token))
})

const App = ({
  screen,
  gist,
  game,
  booted,
  setScreen,
  fetchGist,
  fetchToken,
  finishBoot,
  updateGame,
  token,
  setNextAction
}) => {
  const options = {
    [screenTypes.BOOT]: () => (
      <Boot
        setScreen={setScreen}
        fetchGist={fetchGist}
        finishBoot={finishBoot}
        gist={gist}
        booted={booted}
      />
    ),
    [screenTypes.RUN]: () => (
      <Run game={game} screen={screen} setScreen={setScreen} />
    ),
    [screenTypes.EDITOR]: () => (
      <Editor
        game={game}
        gist={gist}
        token={token}
        setNextAction={setNextAction}
        fetchToken={fetchToken}
        screen={screen}
        setScreen={setScreen}
        updateGame={updateGame}
      />
    )
  }

  const component = options[screen]()

  return <div className='App'>{component}</div>
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
