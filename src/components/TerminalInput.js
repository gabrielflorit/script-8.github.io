import React, { Component } from 'react'

const addBlock = s => {
  return s.replace('█', '').replace(/$/, '█')
} 

class TerminalInput extends Component {
  constructor (props) {
    super(props)
    this.state = { value: addBlock('') }

    this.handleBlur = this.handleBlur.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleBlur (e) {
    e.currentTarget.focus()
  }

  handleChange (e) {
    this.setState({ value: addBlock(e.target.value) })
  }

  handleSubmit (e) {
    e.preventDefault()
    this.setState({ value: addBlock('') })
  }

  render () {
    return (
      <div className='TerminalInput'>
        <form onSubmit={this.handleSubmit}>
          <input
            spellCheck='false'
            type='text'
            value={this.state.value}
            onChange={this.handleChange}
            autoFocus
            onBlur={this.handleBlur}
          />
        </form>
      </div>
    )
  }
}

export default TerminalInput
