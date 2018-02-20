import React, { Component } from 'react'

class Oauth extends Component {
  componentDidMount () {
    const token = window.location.href.match(/\?code=(.*)#\/oauth/)[1]
    window.opener.handleToken(token)
    window.close()
  }

  render () {
    return <div className='Oauth' />
  }
}

export default Oauth
