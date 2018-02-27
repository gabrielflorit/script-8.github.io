import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import actions, { saveGist, fetchToken } from '../actions/actions.js'

const mapStateToProps = ({ gist, game, token, nextAction }) => ({
  gist,
  game,
  token,
  nextAction
})

const mapDispatchToProps = (dispatch, props) => ({
  clearNextAction: () => dispatch(actions.clearNextAction()),
  fetchToken: token => dispatch(fetchToken(token)),
  newGame: () => dispatch(actions.newGame()),
  saveGist: ({ game, token, gist }) =>
    dispatch(saveGist({ game, token, gist })),
  setNextAction: nextAction => dispatch(actions.setNextAction(nextAction))
})

class Menu extends Component {
  constructor (props) {
    super(props)

    this.onSaveClick = this.onSaveClick.bind(this)
    this.onNewClick = this.onNewClick.bind(this)
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
    const { token, game, saveGist, gist } = this.props
    saveGist({ token, game, gist })
  }

  onNewClick () {
    this.props.newGame()
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
    const { gist, game } = this.props

    // If the game isn't equal to the gist,
    // set flag to dirty.
    const gistGame = _.get(gist, 'data.files["code.js"].content', null)
    const dirty = gistGame !== game

    return (
      <ul className='Menu'>
        <li>
          <button onClick={this.onNewClick}>New</button>
        </li>
        <li>
          <button onClick={this.onSaveClick}>Save{dirty ? ' *' : ''}</button>
        </li>
      </ul>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
