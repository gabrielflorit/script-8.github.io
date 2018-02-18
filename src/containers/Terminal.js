import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TerminalHistory from './../components/TerminalHistory.js'
import TerminalInput from './../components/TerminalInput.js'
import actions from './../actions/actions.js'

const mapStateToProps = state => ({
  history: state.terminalHistory
})

const mapDispatchToProps = dispatch => ({
  onInput: input => dispatch(actions.inputTerminalCommand(input))
})

const Terminal = ({ history, onInput }) => (
  <div className='Terminal'>
    <TerminalHistory history={history} />
    <TerminalInput onInput={onInput} />
  </div>
)

Terminal.propTypes = {
  history: PropTypes.array.isRequired,
  onInput: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Terminal)
