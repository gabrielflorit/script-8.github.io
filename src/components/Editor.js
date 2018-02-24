import React from 'react'
import PropTypes from 'prop-types'
import Output from './Output.js'
import NavBar from './NavBar.js'
import Title from './Title.js'
import Menu from './Menu.js'
import CodeEditor from './CodeEditor.js'

const Editor = ({
  game,
  screen,
  setScreen,
  updateGame,
  token,
  setNextAction,
  fetchToken,
  gist
}) => (
  <div className='Editor'>
    <Title isFetching={gist.isFetching || token.isFetching} />
    <Menu token={token} fetchToken={fetchToken} setNextAction={setNextAction} />
    <NavBar screen={screen} setScreen={setScreen} />
    <CodeEditor game={game} updateGame={updateGame} />
    <Output game={game} />
  </div>
)

Editor.propTypes = {
  game: PropTypes.string,
  gist: PropTypes.object.isRequired,
  screen: PropTypes.string.isRequired,
  token: PropTypes.object.isRequired,
  setScreen: PropTypes.func.isRequired,
  updateGame: PropTypes.func.isRequired,
  setNextAction: PropTypes.func.isRequired,
  fetchToken: PropTypes.func.isRequired
}

export default Editor
