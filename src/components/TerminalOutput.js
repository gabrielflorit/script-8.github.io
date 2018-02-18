import React from 'react'
import PropTypes from 'prop-types'

const TerminalOutput = ({ output }) => (
  <div
    className='TerminalOutput'
    dangerouslySetInnerHTML={{ __html: output }}
  />
)

TerminalOutput.propTypes = {
  output: PropTypes.string.isRequired
}

export default TerminalOutput
