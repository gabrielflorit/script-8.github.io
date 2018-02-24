import React from 'react'
import PropTypes from 'prop-types'
import Output from './Output.js'
import NavBar from './NavBar.js'
import Title from './Title.js'
import Menu from './Menu.js'
import CodeEditor from './CodeEditor.js'

const Editor = ({ game, screen, setScreen, updateGame }) => (
  <div className='Editor'>
    <Title />
    <Menu />
    <NavBar screen={screen} setScreen={setScreen} />
    <CodeEditor game={game} updateGame={updateGame} />
    <Output game={game} />
  </div>
)

Editor.propTypes = {
  game: PropTypes.string,
  screen: PropTypes.string.isRequired,
  setScreen: PropTypes.func.isRequired,
  updateGame: PropTypes.func.isRequired
}

export default Editor
