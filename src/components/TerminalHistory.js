import React from 'react'
import PropTypes from 'prop-types'
import TerminalInput from './TerminalInput.js'
import TerminalOutput from './TerminalOutput.js'

const TerminalHistory = ({ history }) => {
  const entries = history.map((d, i) => (
    <div key={i}>
      {d.input ? <TerminalInput input={d.input} /> : null}
      <TerminalOutput output={d.output} />
    </div>
  ))

  return <div className='TerminalHistory'>{entries}</div>
}

TerminalHistory.propTypes = {
  history: PropTypes.array.isRequired
}

export default TerminalHistory
