import { createActions } from 'redux-actions'
import GitHub from 'github-api'
import actionTypes from './actionTypes.js'
import commands from '../utils/commands.js'

const actions = createActions({
  [actionTypes.INPUT_TERMINAL_COMMAND]: (input, history) => {
    // Get the corresponding command.
    const command = commands.find(input)

    if (command && command.name === 'editor') {
      history && history.push('/editor')
    }

    return input
  },
  [actionTypes.CLEAR_TERMINAL]: () => {},
  [actionTypes.UPDATE_GAME]: game => game,
  [actionTypes.TOKEN_REQUEST]: tempCode => tempCode,
  [actionTypes.TOKEN_SUCCESS]: token => token,
  [actionTypes.CREATE_GIST_REQUEST]: () => {},
  [actionTypes.CREATE_GIST_SUCCESS]: data => data
})

export const fetchToken = code => {
  return function (dispatch) {
    dispatch(actions.tokenRequest())

    return fetch(`https://script-8-dev.herokuapp.com/authenticate/${code}`)
      .then(
        response => response.json(),
        error => console.log('An error occurred.', error)
      )
      .then(json => dispatch(actions.tokenSuccess(json)))
  }
}

export const createGist = ({ game, token }) => {
  return function (dispatch) {
    dispatch(actions.createGistRequest())

    const gh = new GitHub({
      token
    })

    const gist = gh.getGist()
    const data = {
      public: true,
      description: 'SCRIPT-8 files',
      files: {
        'code.js': {
          content: 'a test'
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
}

export default actions
