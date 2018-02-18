import React from 'react'
import TerminalInput from './TerminalInput.js'

const TerminalHistory = ({ history }) => {

  const entries = history.map((d, i) => 
    <div key={i}>
      <TerminalInput input={d.input} />
      <div className='TerminalOutput'>
        {d.output}
      </div>
    </div>
  )

  return (
    <div className='TerminalHistory'>
      {entries}
    </div>
  )
}

export default TerminalHistory
