import React from 'react'
import { connect } from 'react-redux'
import actions from '../actions/actions.js'
import Output from '../components/Output.js'
import NavBar from '../components/NavBar.js'
import Title from '../components/Title.js'
import Updater from '../components/Updater.js'

const mapStateToProps = ({ screen, gist, game }) => ({
  screen,
  gist,
  game
})

const mapDispatchToProps = (dispatch, props) => ({
  setScreen: screen => dispatch(actions.setScreen(screen))
})

const Run = ({ game, screen, setScreen, gist }) => (
  <div className='Run'>
    <Updater gist={gist} />
    <Title />
    <NavBar screen={screen} setScreen={setScreen} />
    <Output game={game} run />
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(Run)
