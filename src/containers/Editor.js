import React from 'react'
import { connect } from 'react-redux'
import CodeEditor from '../components/CodeEditor.js'
import Output from '../components/Output.js'
import PropTypes from 'prop-types'
import actions from './../actions/actions.js'

const mapStateToProps = ({ game }) => ({
  game
})

const mapDispatchToProps = dispatch => ({
  onUpdate: update => dispatch(actions.updateGame(update))
})

const Editor = ({ game, onUpdate }) => (
  <div className='Editor'>
    <CodeEditor onUpdate={onUpdate} />
    <Output game={game} />
  </div>
)


Editor.propTypes = {
  game: PropTypes.string,
  onUpdate: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
