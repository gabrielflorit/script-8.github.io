import React from 'react'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'
// import TerminalHistory from './../components/TerminalHistory.js'
// import TerminalInput from './../components/TerminalInput.js'
// import actions from './../actions/actions.js'

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  // onInput: input => dispatch(actions.inputTerminalCommand(input))
})

const Editor = ({ history, onInput }) => <div className='Editor'>editor</div>

Editor.propTypes = {}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
