import React from 'react'
import PropTypes from 'prop-types'

const TextInput = ({ label, value, type, handleChange, options }) => (
  <div className='TextInput'>
    <label>
      {label}
      <input type={type} value={value} {...options} onChange={handleChange} />
    </label>
  </div>
)

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  options: PropTypes.object
}

export default TextInput
