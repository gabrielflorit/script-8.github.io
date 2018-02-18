import React from 'react'
import TerminalInput from './TerminalInput.js'

const TerminalHistory = ({ history }) => {
  const entries = history.map((d, i) => {
    const input = d.input ? <TerminalInput input={d.input} /> : null
    const outputHtml = {
      __html: d.output
    }
    return (
      <div key={i}>
        {input}
        <div className='TerminalOutput' dangerouslySetInnerHTML={outputHtml} />
      </div>
    )
  })

  return <div className='TerminalHistory'>{entries}</div>
}

export default TerminalHistory

// DChM032kbz