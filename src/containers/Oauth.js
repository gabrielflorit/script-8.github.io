import React, { Component } from 'react'

class Oauth extends Component {
  componentDidMount () {
    const code = window.location.href.match(/\?code=(.*)#\/oauth/)[1]
    window.opener.handleCode(code)
    window.close()
  }

  render () {
    return <div className='Oauth' />
  }
}

export default Oauth
