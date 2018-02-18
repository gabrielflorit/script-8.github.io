import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TerminalHistory from '../components/TerminalHistory.js'
import TerminalInput from '../components/TerminalInput.js'
import actions from '../actions/actions.js'

const mapStateToProps = state => ({
  terminalHistory: state.terminalHistory
})

const mapDispatchToProps = (dispatch, props) => ({
  onInput: input => dispatch(actions.inputTerminalCommand(input, props.history))
})

const Terminal = ({ terminalHistory, onInput }) => (
  <div className='Terminal'>
    <TerminalHistory terminalHistory={terminalHistory} />
    <TerminalInput onInput={onInput} />
  </div>
)

Terminal.propTypes = {
  terminalHistory: PropTypes.array.isRequired,
  onInput: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Terminal)
