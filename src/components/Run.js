import React from 'react'
import PropTypes from 'prop-types'
import Output from './Output.js'
import NavBar from './NavBar.js'

const Run = ({ game }) => (
  <div className='Run'>
    <NavBar />
    <Output game={game} run />
  </div>
)

Run.propTypes = {
  game: PropTypes.string
}

export default Run
