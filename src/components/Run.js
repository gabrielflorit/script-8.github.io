import React from 'react'
import PropTypes from 'prop-types'
import Output from './Output.js'
import NavBar from './NavBar.js'
import Title from './Title.js'
import Updater from './Updater.js'

const Run = ({ game, screen, setScreen, gist }) => (
  <div className='Run'>
    <Updater gist={gist} />
    <Title />
    <NavBar screen={screen} setScreen={setScreen} />
    <Output game={game} run />
  </div>
)

Run.propTypes = {
  game: PropTypes.string,
  screen: PropTypes.string.isRequired,
  gist: PropTypes.object.isRequired,
  setScreen: PropTypes.func.isRequired
}

export default Run
