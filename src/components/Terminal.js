import React, { Component } from 'react'
import TerminalInput from './TerminalInput.js'
import TerminalHistory from './TerminalHistory.js'

class Terminal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      history: [
        {
          input: 'help',
          output: 'type help for help'
        }
      ]
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (s) {
    this.setState({
      history: [
        ...this.state.history,
        {
          input: s,
          output: 'type help for help'
        }
      ]
    })
  }

  render () {
    return (
      <div className='Terminal'>
        <TerminalHistory history={this.state.history} />
        <TerminalInput handleSubmit={this.handleSubmit} />
      </div>
    )
  }
}

export default Terminal
