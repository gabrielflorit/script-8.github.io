import React, { Component } from 'react'
import PropTypes from 'prop-types'
import twas from 'twas'

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
        `https://github.com/login/oauth/authorize?client_id=${
          process.env.REACT_APP_CLIENT_ID
        }&scope=gist`,
        'popup',
        'width=600,height=700'
      )
    } else {
      // If we are logged in, save.
      this.save()
    }
  }

  render () {
    const { gist } = this.props
    let urlLi
    if (gist.data && gist.data.html_url) {
      urlLi = (
        <li>
          <a className='minor' target='_blank' href={gist.data.html_url}>(saved {twas(new Date(gist.data.updated_at))})</a>
        </li>
      )
    }

    return (
      <ul className='Menu'>
        <li>
          <button
            disabled={gist.isFetching}
            className={gist.isFetching ? 'disabled' : ''}
            onClick={this.onSaveClick}
          >
            Save
          </button>
        </li>
        {urlLi}
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
  gist: PropTypes.object,
  token: PropTypes.object
}

export default Menu
