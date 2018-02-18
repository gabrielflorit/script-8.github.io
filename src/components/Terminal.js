import React, { Component } from 'react'
import TerminalInput from './TerminalInput.js'
import TerminalHistory from './TerminalHistory.js'
import makeOutput from './../utils/makeOutput.js'

class Terminal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      history: [
        {
          output: makeOutput('intro')
        },
        {
          output: makeOutput('help')
        },
      ]
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (input) {
    this.setState({
      history: [
        ...this.state.history,
        {
          input,
          output: makeOutput(input)
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
