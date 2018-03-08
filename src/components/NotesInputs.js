import React from 'react'
import PropTypes from 'prop-types'

const defaultFormatter = x => x

const NotesInputs = ({ notes, formatter = defaultFormatter }) => (
  <ul className='NotesInputs'>
    {notes.map((note, i) => (
      <li key={i}>
        <button>{note ? formatter(note) : '-'}</button>
      </li>
    ))}
  </ul>
)

NotesInputs.propTypes = {
  formatter: PropTypes.func,
  notes: PropTypes.array.isRequired
}

export default NotesInputs
