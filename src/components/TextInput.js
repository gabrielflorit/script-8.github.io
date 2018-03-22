import React from 'react'
import PropTypes from 'prop-types'

const TextInput = ({ label }) => (
  <div className='TextInput'>
    <label>
      {label}
      <input type='text' />
    </label>
  </div>
)

TextInput.propTypes = {
  label: PropTypes.string.isRequired
}

export default TextInput
