import React from 'react'
import { connect } from 'react-redux'
import CodeEditor from '../components/CodeEditor.js'
import Output from '../components/Output.js'
import NavBar from '../components/NavBar.js'
import Menu from '../components/Menu.js'
import Title from '../components/Title.js'
import PropTypes from 'prop-types'
import actions, { createGist, fetchToken } from './../actions/actions.js'

const mapStateToProps = ({ game, token, nextAction, gist }) => ({
  game,
  token,
  gist,
  nextAction
})

const mapDispatchToProps = dispatch => ({
  onUpdate: update => dispatch(actions.updateGame(update)),
  fetchToken: code => dispatch(fetchToken(code)),
  createGist: ({ token, game }) => dispatch(createGist({ token, game })),
  setNextAction: nextAction => dispatch(actions.setNextAction(nextAction)),
  clearNextAction: () => dispatch(actions.clearNextAction())
})

const Editor = ({
  game,
  nextAction,
  onUpdate,
  fetchToken,
  createGist,
  token,
  gist,
  setNextAction,
  clearNextAction
}) => (
  <div className='Editor'>
    <Title isFetching={gist.isFetching || token.isFetching} />
    <Menu
      gist={gist}
      fetchToken={fetchToken}
      nextAction={nextAction}
      clearNextAction={clearNextAction}
      setNextAction={setNextAction}
      token={token}
      createGist={createGist}
      game={game}
    />
    <NavBar />
    <CodeEditor game={game} onUpdate={onUpdate} />
    <Output game={game} />
  </div>
)

Editor.propTypes = {
  game: PropTypes.string,
  nextAction: PropTypes.string,
  token: PropTypes.object,
  gist: PropTypes.object,
  onUpdate: PropTypes.func.isRequired,
  createGist: PropTypes.func.isRequired,
  fetchToken: PropTypes.func.isRequired,
  setNextAction: PropTypes.func.isRequired,
  clearNextAction: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
