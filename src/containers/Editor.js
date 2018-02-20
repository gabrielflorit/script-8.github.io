import React from 'react'
import { connect } from 'react-redux'
import CodeEditor from '../components/CodeEditor.js'
import Output from '../components/Output.js'
import Menu from '../components/Menu.js'
import PropTypes from 'prop-types'
import actions, { createGist, fetchToken } from './../actions/actions.js'

const mapStateToProps = ({ game, token }) => ({
  game,
  token
})

const mapDispatchToProps = dispatch => ({
  onUpdate: update => dispatch(actions.updateGame(update)),
  tokenRequest: code => dispatch(fetchToken(code)),
  createGist: ({ token, game }) => dispatch(createGist({ token, game }))
})

const Editor = ({ game, onUpdate, tokenRequest, createGist, token }) => (
  <div className='Editor'>
    <Menu
      tokenRequest={tokenRequest}
      token={token}
      createGist={createGist}
      game={game}
    />
    <CodeEditor game={game} onUpdate={onUpdate} />
    <Output game={game} />
  </div>
)

Editor.propTypes = {
  game: PropTypes.string,
  token: PropTypes.object,
  onUpdate: PropTypes.func.isRequired,
  createGist: PropTypes.func.isRequired,
  tokenRequest: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
