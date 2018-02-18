import React from 'react'

const TerminalOutput = ({ output }) => {
  const outputHtml = {
    __html: output
  }
  return (
    <div className='TerminalOutput' dangerouslySetInnerHTML={outputHtml} />
  )
}

export default TerminalOutput
