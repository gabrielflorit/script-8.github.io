import React from 'react'
import PropTypes from 'prop-types'
import Output from './Output.js'

const Run = ({ game, run }) => {
  return (
    <div className='Run'>
      <Output game={game} run />
    </div>
  )
}

Run.propTypes = {
  game: PropTypes.string,
  run: PropTypes.bool
}

export default Run
