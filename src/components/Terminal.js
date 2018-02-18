import React, { Component } from 'react'
import TerminalInput from './TerminalInput.js'

// TODO:
// there will be two kinds of displays
// output and input
//

class Terminal extends Component {
  render () {
    return (
      <div className='Terminal'>
        <div className='TerminalOutput'>
          <div>type <em>help</em> for help</div>
        </div>
        <TerminalInput />
      </div>
    )
  }
}

export default Terminal
