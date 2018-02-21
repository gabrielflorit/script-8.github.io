import React from 'react'
import { connect } from 'react-redux'
import Output from '../components/Output.js'
import Title from '../components/Title.js'
import Updater from '../components/Updater.js'
import NavBar from '../components/NavBar.js'

const mapStateToProps = ({ game, gist }) => ({
  game,
  gist
})

const mapDispatchToProps = () => ({})

const Run = ({ game, gist, history }) => (
  <div className='Run'>
    <Updater gist={gist} history={history} />
    <Title />
    <NavBar />
    <Output game={game} run />
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(Run)
