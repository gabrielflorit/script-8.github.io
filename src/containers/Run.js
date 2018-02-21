import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Output from '../components/Output.js'
import Title from '../components/Title.js'
import NavBar from '../components/NavBar.js'

const mapStateToProps = ({ game }) => ({
  game
})

const mapDispatchToProps = dispatch => ({})

const Run = ({ game }) => (
  <div className='Run'>
    <Title />
    <NavBar />
    <Output game={game} run />
  </div>
)

Run.propTypes = {
  game: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(Run)
