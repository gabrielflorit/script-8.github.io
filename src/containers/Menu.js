import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import equal from 'deep-equal'
import actions, { saveGist, fetchToken } from '../actions/actions.js'
import screenTypes from '../utils/screenTypes.js'
import { parseGistSfxs } from '../reducers/sfxs.js'

const mapStateToProps = ({
  gist,
  game,
  sfxs,
  phrases,
  token,
  screen,
  nextAction
}) => ({
  showNew: screen === screenTypes.CODE,
  gist,
  game,
  sfxs,
  phrases,
  token,
  nextAction
})

const mapDispatchToProps = (dispatch, props) => ({
  clearNextAction: () => dispatch(actions.clearNextAction()),
  fetchToken: token => dispatch(fetchToken(token)),
  newGame: () => dispatch(actions.newGame()),
  saveGist: ({ game, sfxs, token, gist, phrases }) =>
    dispatch(saveGist({ game, sfxs, token, gist, phrases })),
  setNextAction: nextAction => dispatch(actions.setNextAction(nextAction))
})

class Menu extends Component {
  constructor (props) {
    super(props)

    this.onSaveClick = this.onSaveClick.bind(this)
    this.onNewClick = this.onNewClick.bind(this)
    this.save = this.save.bind(this)
    window.script8.handleCode = props.fetchToken
  }

  componentDidUpdate () {
    const { token, nextAction, clearNextAction } = this.props
    if (token.value && nextAction === 'save') {
      clearNextAction()
      this.save()
    }
  }

  save () {
    const { token, game, saveGist, gist, sfxs, phrases } = this.props
    saveGist({ token, game, sfxs, phrases, gist })
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
    const { sfxs, gist, game, showNew } = this.props

    // If the game isn't equal to the gist,
    // set flag to dirty.
    const gistSfxs = parseGistSfxs(gist.data)
    const gistGame = _.get(gist, 'data.files["code.js"].content', null)
    const dirty = !(equal(gistGame, game) && equal(gistSfxs, sfxs))

    const newLi = showNew ? (
      <li>
        <button className='button' onClick={this.onNewClick}>
          New
        </button>
      </li>
    ) : null

    return (
      <ul className='Menu'>
        {newLi}
        <li>
          <button className='button' onClick={this.onSaveClick}>
            Save{dirty ? ' *' : ''}
          </button>
        </li>
      </ul>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
