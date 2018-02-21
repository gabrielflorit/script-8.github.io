import React from 'react'
import { connect } from 'react-redux'
import TerminalHistory from '../components/TerminalHistory.js'
import TerminalInput from '../components/TerminalInput.js'
import Updater from '../components/Updater.js'
import actions from '../actions/actions.js'

const mapStateToProps = ({ terminalHistory, gist }) => ({
  terminalHistory,
  gist
})

const mapDispatchToProps = (dispatch, props) => ({
  onInput: input => dispatch(actions.inputTerminalCommand(input, props.history))
})

const Terminal = ({ terminalHistory, onInput, gist, history }) => (
  <div className='Terminal'>
    <Updater gist={gist} history={history} />
    <TerminalHistory terminalHistory={terminalHistory} />
    <TerminalInput onInput={onInput} />
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(Terminal)
