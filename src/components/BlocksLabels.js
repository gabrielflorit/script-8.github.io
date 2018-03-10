import React from 'react'
import PropTypes from 'prop-types'

const defaultFormatter = x => x

const BlocksLabels = ({ notes, formatter = defaultFormatter }) => (
  <ul className='BlocksLabels'>
    {notes.map((note, i) => (
      <li key={i}>
        <button>{formatter(note)}</button>
      </li>
    ))}
  </ul>
)

BlocksLabels.propTypes = {
  formatter: PropTypes.func,
  notes: PropTypes.array.isRequired
}

export default BlocksLabels
