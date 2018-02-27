import React from 'react'
import { connect } from 'react-redux'
import Boot from './Boot.js'
import Run from './Run.js'
import Editor from '../components/Editor.js'
import actions, { saveGist, fetchGist, fetchToken } from '../actions/actions.js'
import screenTypes from '../utils/screenTypes.js'
import '../css/App.css'

const mapStateToProps = ({
  screen,
  gist,
  booted,
  game,
  token,
  nextAction
}) => ({
  screen,
  gist,
  booted,
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
  finishBoot: () => dispatch(actions.finishBoot()),
  fetchGist: id => dispatch(fetchGist(id)),
  saveGist: ({ game, token, gist }) =>
    dispatch(saveGist({ game, token, gist })),
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
  clearNextAction,
  updateGame,
  token,
  saveGist,
  setNextAction,
  nextAction,
  newGame
}) => {
  const options = {
    [screenTypes.BOOT]: () => <Boot />,
    [screenTypes.RUN]: () => <Run />,
    [screenTypes.CODE]: () => (
      <Editor
        game={game}
        gist={gist}
        token={token}
        nextAction={nextAction}
        setNextAction={setNextAction}
        clearNextAction={clearNextAction}
        saveGist={saveGist}
        fetchToken={fetchToken}
        screen={screen}
        setScreen={setScreen}
        updateGame={updateGame}
        newGame={newGame}
      />
    )
  }

  const component = options[screen]()

  return <div className='App'>{component}</div>
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
