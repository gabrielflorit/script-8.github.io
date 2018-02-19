import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Output from '../components/Output.js'

const mapStateToProps = ({ game }) => ({
  game
})

const mapDispatchToProps = dispatch => ({})

const Run = ({ game }) => (
  <div className='Run'>
    <Output game={game} run />
  </div>
)

Run.propTypes = {
  game: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(Run)
