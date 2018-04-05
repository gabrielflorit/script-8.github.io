import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({ showTutorial }) => ({ showTutorial })

const mapDispatchToProps = dispatch => ({})

class Tutorial extends Component {
  // constructor (props) {
  //   super(props)
  // }

  render () {
    return (
      <div className='Tutorial'>
        This is a tutorial. Click <button className='button'>here</button> to
        begin.
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tutorial)
