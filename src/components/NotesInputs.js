import React from 'react'
import PropTypes from 'prop-types'
import numberToNote from '../utils/numberToNote.js'

const NotesInputs = ({ notes }) => (
  <ul className='NotesInputs'>
    {notes.map((note, i) => (
      <li key={i}>
        <button>{note ? numberToNote(note - 1) : '-'}</button>
      </li>
    ))}
  </ul>
)

NotesInputs.propTypes = {
  notes: PropTypes.array.isRequired
}

export default NotesInputs
