import React from 'react'
import { connect } from 'react-redux'
import actions from '../actions/actions.js'
import Output from './Output.js'
import NavBar from '../components/NavBar.js'
import Title from '../components/Title.js'
import Updater from './Updater.js'

const mapStateToProps = ({ screen }) => ({
  screen
})

const mapDispatchToProps = (dispatch, props) => ({
  setScreen: screen => dispatch(actions.setScreen(screen))
})

const Run = ({ screen, setScreen }) => (
  <div className='Run'>
    <Updater />
    <Title />
    <NavBar screen={screen} setScreen={setScreen} />
    <Output />
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(Run)
