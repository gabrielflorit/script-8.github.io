import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

class Menu extends Component {
  constructor (props) {
    super(props)

    this.onLoginClick = this.onLoginClick.bind(this)
    this.onSaveClick = this.onSaveClick.bind(this)
    window.handleCode = props.tokenRequest
  }

  onLoginClick () {
    window.open(
      'https://github.com/login/oauth/authorize?client_id=c1ca99e7f6da7d558e3c&scope=gist',
      'popup',
      'width=600,height=700'
    )
  }

  onSaveClick () {
    const { token, game, createGist } = this.props
    createGist({ token: token.value, game })
  }

  render () {
    return (
      <ul className='Menu'>
        <li>
          <NavLink exact activeClassName='active' to='/'>
            System
          </NavLink>
        </li>
        <li>
          <NavLink exact activeClassName='active' to='/editor'>
            Editor
          </NavLink>
        </li>
        <li>
          <NavLink exact activeClassName='active' to='/run'>
            Run
          </NavLink>
        </li>
        <li>
          <button onClick={this.onLoginClick}>Login</button>
        </li>
        <li>
          <button onClick={this.onSaveClick}>Save</button>
        </li>
      </ul>
    )
  }
}

Menu.propTypes = {
  createGist: PropTypes.func,
  tokenRequest: PropTypes.func,
  game: PropTypes.string,
  token: PropTypes.object
}

export default Menu
