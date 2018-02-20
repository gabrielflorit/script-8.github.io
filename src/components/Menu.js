import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

class Menu extends Component {
  constructor (props) {
    super(props)

    this.onSaveClick = this.onSaveClick.bind(this)
    this.save = this.save.bind(this)
    window.handleCode = props.fetchToken
  }

  componentDidUpdate () {
    const { token, nextAction, clearNextAction } = this.props
    if (token.value && nextAction === 'save') {
      clearNextAction()
      this.save()
    }
  }

  save () {
    const { token, game, createGist } = this.props
    createGist({ token: token.value, game })
  }

  onSaveClick () {
    const { token, setNextAction } = this.props

    // If we're not logged in,
    if (!token.value) {
      // remind ourselves to save next,
      setNextAction('save')

      // and log in.
      window.open(
        'https://github.com/login/oauth/authorize?client_id=c1ca99e7f6da7d558e3c&scope=gist',
        'popup',
        'width=600,height=700'
      )
    } else {
      // If we are logged in, save.
      this.save()
    }
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
          <button onClick={this.onSaveClick}>Save</button>
        </li>
      </ul>
    )
  }
}

Menu.propTypes = {
  createGist: PropTypes.func,
  fetchToken: PropTypes.func,
  setNextAction: PropTypes.func,
  clearNextAction: PropTypes.func,
  game: PropTypes.string,
  nextAction: PropTypes.string,
  token: PropTypes.object
}

export default Menu
