import React, { Component } from 'react'

class TerminalInput extends Component {
  constructor (props) {
    super(props)
    this.state = { value: this.props.input || '' }

    this.handleBlur = this.props.input ? this.noop : this.handleBlur.bind(this)
    this.handleChange = this.props.input
      ? this.noop
      : this.handleChange.bind(this)
    this.handleSubmit = this.props.input
      ? this.noop
      : this.handleSubmit.bind(this)
  }

  noop () {}

  handleBlur (e) {
    e.currentTarget.focus()
  }

  handleChange (e) {
    this.setState({ value: e.target.value })
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.handleSubmit(this.state.value)
    this.setState({ value: '' })
  }

  render () {
    return (
      <div className='TerminalInput'>
        <div className='display'>
          <span>> {this.state.value}</span>
          <span className={'caret ' + (this.props.input ? 'hide' : 'show')}>
            ■
          </span>
        </div>
        <form onSubmit={this.handleSubmit}>
          <input
            className='control'
            spellCheck='false'
            type='text'
            value={this.state.value}
            onChange={this.handleChange}
            autoFocus={!this.props.input}
            onBlur={this.handleBlur}
          />
        </form>
      </div>
    )
  }
}

export default TerminalInput
