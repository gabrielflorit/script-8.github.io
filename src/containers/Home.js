import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => ({})

class Home extends Component {
  render () {
    return (
      <div className='Home'>
        <div className='main'>Welcome.</div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
