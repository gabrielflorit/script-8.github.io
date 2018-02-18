import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TerminalHistory from './../components/TerminalHistory.js'

const mapStateToProps = state => ({
  history: state.terminalHistory
})

const mapDispatchToProps = dispatch => ({})

const Terminal = ({ history }) => (
  <div className='Terminal'>
    <TerminalHistory history={history} />
  </div>
)

Terminal.propTypes = {
  history: PropTypes.array.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Terminal)

















// class Terminal extends Component {
//   constructor (props) {
//     super(props)
//     // this.state = {
//     //   history: [
//     //     // {
//     //     //   output: makeOutput('intro')
//     //     // },
//     //     // {
//     //     //   output: makeOutput('help')
//     //     // },
//     //   ]
//     // }
//     // this.handleSubmit = this.handleSubmit.bind(this)
//   }

//   // handleSubmit (input) {
//   //   this.setState({
//   //     history: [
//   //       ...this.state.history,
//   //       // {
//   //       //   input,
//   //       //   output: makeOutput(input)
//   //       // }
//   //     ]
//   //   })
//   // }

//   render () {
//     return <div className='Terminal'>this is the terminal</div>
//   }
// }


// <TerminalHistory history={this.state.history} />
// <TerminalInput handleSubmit={this.handleSubmit} />
