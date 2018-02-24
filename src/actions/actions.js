import { createActions } from 'redux-actions'
import actionTypes from './actionTypes.js'
import GitHub from 'github-api'

const actions = createActions({
  [actionTypes.SET_SCREEN]: screen => screen,
  [actionTypes.FETCH_GIST_REQUEST]: () => {},
  [actionTypes.FETCH_GIST_SUCCESS]: data => data,
  [actionTypes.FINISH_BOOT]: () => {},
  [actionTypes.UPDATE_GAME]: game => game,
  [actionTypes.TOKEN_REQUEST]: () => {},
  [actionTypes.TOKEN_SUCCESS]: token => token,
  [actionTypes.SET_NEXT_ACTION]: action => action,
  [actionTypes.CLEAR_NEXT_ACTION]: () => {},
  [actionTypes.CREATE_GIST_REQUEST]: () => {},
  [actionTypes.CREATE_GIST_SUCCESS]: data => data
})

export default actions

export const fetchGist = id => dispatch => {
  dispatch(actions.fetchGistRequest())

  return window
    .fetch(`https://my-service-dqzpehqqcr.now.sh/${id}`)
    .then(
      response => response.json(),
      error => console.log('An error occurred.', error)
    )
    .then(json => dispatch(actions.fetchGistSuccess(json)))
}

export const fetchToken = code => dispatch => {
  dispatch(actions.tokenRequest())

  return window
    .fetch(`${process.env.REACT_APP_AUTHENTICATOR}/authenticate/${code}`)
    .then(
      response => response.json(),
      error => console.log('An error occurred.', error)
    )
    .then(json => dispatch(actions.tokenSuccess(json)))
}

export const createGist = ({ game, token }) => dispatch => {
  dispatch(actions.createGistRequest())

  const gh = new GitHub({
    token
  })

  const gist = gh.getGist()
  const data = {
    public: true,
    description: 'SCRIPT-8',
    files: {
      'code.js': {
        content: game
      }
    }
  }

  return gist
    .create(data)
    .then(
      response => response.data,
      error => console.log('An error occurred.', error)
    )
    .then(data => dispatch(actions.createGistSuccess(data)))
}
