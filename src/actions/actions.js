import { createActions } from 'redux-actions'
import actionTypes from './actionTypes.js'
// import GitHub from 'github-api'

const actions = createActions({
  [actionTypes.SET_SCREEN]: screen => screen,
  [actionTypes.FETCH_GIST_REQUEST]: () => {},
  [actionTypes.FETCH_GIST_SUCCESS]: data => data
})

export const fetchGist = ({ token, id }) => {
  return function (dispatch) {
    dispatch(actions.fetchGistRequest())

    const gh = new GitHub({
      token
    })

//     const gist = gh.getGist()
//     const data = {
//       public: true,
//       description: 'SCRIPT-8',
//       files: {
//         'code.js': {
//           content: game
//         }
//       }
//     }

//     return gist
//       .create(data)
//       .then(
//         response => response.data,
//         error => console.log('An error occurred.', error)
//       )
//       .then(data => dispatch(actions.createGistSuccess(data)))
  }
}

export default actions


//   return function (dispatch) {
//     dispatch(actions.createGistRequest())

//     const gh = new GitHub({
//       token
//     })

//     const gist = gh.getGist()
//     const data = {
//       public: true,
//       description: 'SCRIPT-8',
//       files: {
//         'code.js': {
//           content: game
//         }
//       }
//     }

//     return gist
//       .create(data)
//       .then(
//         response => response.data,
//         error => console.log('An error occurred.', error)
//       )
//       .then(data => dispatch(actions.createGistSuccess(data)))
//   }

































  // [actionTypes.INPUT_TERMINAL_COMMAND]: (input, history) => {
  //   // Get the corresponding command.
  //   const command = commands.find(input)

  //   if (command && command.name === 'editor') {
  //     history && history.push('/editor')
  //   }

  //   return input
  // },
  // [actionTypes.CLEAR_TERMINAL]: () => {},
  // [actionTypes.UPDATE_GAME]: game => game,
  // [actionTypes.TOKEN_REQUEST]: tempCode => tempCode,
  // [actionTypes.TOKEN_SUCCESS]: token => token,
  // [actionTypes.CREATE_GIST_REQUEST]: () => {},
  // [actionTypes.CREATE_GIST_SUCCESS]: data => data,
  // [actionTypes.SET_NEXT_ACTION]: nextAction => nextAction,
  // [actionTypes.CLEAR_NEXT_ACTION]: () => {}

// export const createGist = ({ game, token }) => {
//   return function (dispatch) {
//     dispatch(actions.createGistRequest())

//     const gh = new GitHub({
//       token
//     })

//     const gist = gh.getGist()
//     const data = {
//       public: true,
//       description: 'SCRIPT-8',
//       files: {
//         'code.js': {
//           content: game
//         }
//       }
//     }

//     return gist
//       .create(data)
//       .then(
//         response => response.data,
//         error => console.log('An error occurred.', error)
//       )
//       .then(data => dispatch(actions.createGistSuccess(data)))
//   }
// }


// export const fetchToken = code => {
//   return function (dispatch) {
//     dispatch(actions.tokenRequest())

//     return fetch(`${process.env.REACT_APP_AUTHENTICATOR}/authenticate/${code}`)
//       .then(
//         response => response.json(),
//         error => console.log('An error occurred.', error)
//       )
//       .then(json => dispatch(actions.tokenSuccess(json)))
//   }
// }

