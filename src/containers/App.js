import React from 'react'
import { connect } from 'react-redux'
import Boot from '../components/Boot.js'
import Run from '../components/Run.js'
import Editor from '../components/Editor.js'
import actions, { fetchGist } from '../actions/actions.js'
import screenTypes from '../utils/screenTypes.js'
import '../css/App.css'

const mapStateToProps = ({ screen, gist, booted, game }) => ({
  screen,
  gist,
  booted,
  game
})

const mapDispatchToProps = (dispatch, props) => ({
  updateGame: game => dispatch(actions.updateGame(game)),
  setScreen: screen => dispatch(actions.setScreen(screen)),
  finishBoot: () => dispatch(actions.finishBoot()),
  fetchGist: id => dispatch(fetchGist(id))
})

const App = ({
  screen,
  gist,
  game,
  booted,
  setScreen,
  fetchGist,
  finishBoot,
  updateGame
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
