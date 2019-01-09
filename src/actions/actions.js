import { createActions } from 'redux-actions'
import GitHub from 'github-api'
import _ from 'lodash'
import actionTypes from './actionTypes.js'
import screenTypes from '../utils/screenTypes.js'
import { compressPhrases } from '../reducers/phrases.js'
import throwError from '../utils/throwError.js'

const actions = createActions({
  [actionTypes.TOGGLE_SOUND]: () => {},
  [actionTypes.SET_SCREEN]: d => d,
  [actionTypes.FETCH_GIST_REQUEST]: () => {},
  [actionTypes.FETCH_GIST_SUCCESS]: d => d,
  [actionTypes.FINISH_BOOT]: () => {},
  [actionTypes.UPDATE_GAME]: d => d,
  [actionTypes.NEW_GAME]: d => d,
  [actionTypes.TOKEN_REQUEST]: () => {},
  [actionTypes.TOKEN_SUCCESS]: d => d,
  [actionTypes.SET_NEXT_ACTION]: d => d,
  [actionTypes.CLEAR_NEXT_ACTION]: () => {},
  [actionTypes.SAVE_GIST_REQUEST]: () => {},
  [actionTypes.SAVE_GIST_SUCCESS]: d => d,
  [actionTypes.UPDATE_SFX]: d => d,
  [actionTypes.UPDATE_SPRITE]: d => d,
  [actionTypes.UPDATE_MAP]: d => d,
  [actionTypes.UPDATE_PHRASE]: d => d,
  [actionTypes.UPDATE_CHAIN]: d => d,
  [actionTypes.UPDATE_SONG]: d => d,
  [actionTypes.IS_NEW_USER]: () => {},
  [actionTypes.SET_TUTORIAL_SLIDE]: d => d,
  [actionTypes.CLOSE_TUTORIAL]: () => {},
  [actionTypes.SHELVE_CASSETTE_REQUEST]: () => {},
  [actionTypes.SHELVE_CASSETTE_SUCCESS]: d => d,
  [actionTypes.UNSHELVE_CASSETTE_REQUEST]: () => {},
  [actionTypes.UNSHELVE_CASSETTE_SUCCESS]: d => d
})

export default actions

export const unshelve = ({ token, gistId }) => dispatch => {
  dispatch(actions.unshelveCassetteRequest())

  return window
    .fetch(`${process.env.REACT_APP_NOW}/unshelve`, {
      method: 'POST',
      body: JSON.stringify({
        token: token.value,
        gistId
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(
      response => response.json(),
      error =>
        throwError({
          error,
          message: `Could not unshelve cassette via appspot service.`
        })
    )
    .then(json => dispatch(actions.unshelveCassetteSuccess()))
    .then(json => dispatch(actions.setScreen(screenTypes.SHELF)))
}

export const putOnShelf = ({ user, gist, cover, title }) => dispatch => {
  dispatch(actions.shelveCassetteRequest())

  return window
    .fetch(`${process.env.REACT_APP_NOW}/cassette`, {
      method: 'POST',
      body: JSON.stringify({
        user,
        gist,
        cover,
        title
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(
      response => response.json(),
      error =>
        throwError({
          error,
          message: `Could not post cassette via appspot service.`
        })
    )
    .then(json => dispatch(actions.shelveCassetteSuccess()))
    .then(json => dispatch(actions.setScreen(screenTypes.SHELF)))
}

export const fetchGist = ({ id, token }) => dispatch => {
  dispatch(actions.fetchGistRequest())

  if (token && token.value) {
    const gh = new GitHub({ token: token.value })
    return gh
      .getGist(id)
      .read()
      .then(
        response => response.data,
        error =>
          throwError({
            error,
            message: `Could not fetch gist ${id} from GitHub while using an oauth token.`
          })
      )
      .then(json => dispatch(actions.fetchGistSuccess(json)))
  } else {
    return window
      .fetch(`${process.env.REACT_APP_NOW}/gist/${id}`)
      .then(response => {
        console.log({ response })
        return response.json()
      })
      .then(json => dispatch(actions.fetchGistSuccess(json)))
      .catch(error =>
        throwError({
          error,
          message: `Could not fetch gist ${id} from the hosted oauth service.`
        })
      )
  }
}

export const fetchToken = code => dispatch => {
  dispatch(actions.tokenRequest())

  return window
    .fetch(`${process.env.REACT_APP_AUTHENTICATOR}/authenticate/${code}`)
    .then(
      response => response.json(),
      error => throwError({ error, message: 'Could not fetch oauth token.' })
    )
    .then(({ token }) => {
      const gh = new GitHub({ token })

      return gh
        .getUser()
        .getProfile()
        .then(
          response => ({
            token,
            user: response.data
          }),
          error =>
            throwError({
              error,
              message: 'Could not fetch GitHub user despite valid oauth token.'
            })
        )
    })
    .then(json => dispatch(actions.tokenSuccess(json)))
}

export const saveGist = ({
  toBlank,
  game,
  token,
  gist,
  sprites,
  map,
  phrases,
  chains,
  songs
}) => dispatch => {
  dispatch(actions.saveGistRequest())

  const gh = new GitHub({
    token: token.value
  })

  const createLink = id =>
    id ? ` Click [here](https://script-8.github.io/?id=${id}) to boot it.` : ''

  const preparePayload = id => {
    const link = createLink(id)
    const content = `This is a [SCRIPT-8](https://script-8.github.io) cassette.${link}`
    const payload = {
      public: true,
      description: 'SCRIPT-8',
      files: {
        'code.js': {
          content: game
        },
        'sprites.json': {
          content: JSON.stringify(sprites, null, 2)
        },
        'map.json': {
          content: JSON.stringify(map, null, 2)
        },
        'phrases.json': {
          content: JSON.stringify(compressPhrases(phrases), null, 2)
        },
        'chains.json': {
          content: JSON.stringify(chains, null, 2)
        },
        'songs.json': {
          content: JSON.stringify(songs, null, 2)
        },
        'README.md': {
          content
        }
      }
    }

    return payload
  }

  const createGist = () =>
    gh
      .getGist()
      .create(preparePayload())
      .then(
        response => response.data,
        error => throwError({ error, message: 'Could not create gist.' })
      )
      .then(data => dispatch(actions.saveGistSuccess(data)))

  const updateGist = () =>
    gh
      .getGist(gist.data.id)
      .update(preparePayload(gist.data.id))
      .then(
        response => response.data,
        error => throwError({ error, message: 'Could not update gist.' })
      )
      .then(data => dispatch(actions.saveGistSuccess(data)))

  // If there is no gist or we want to record to blank, create it.
  if (!gist.data || toBlank) {
    return createGist()
  } else {
    // If there is a gist, and it is ours,
    if (_.get(gist, 'data.owner.login', null) === token.user.login) {
      // update it.
      return updateGist()
    } else {
      // If it is not ours, create it.
      return createGist()
    }
  }
}

// const gh = new GitHub()
// return gh
//   .getGist(id)
//   .read()
//   .then(
//     response => response.data,
//     error => {
//       if (
//         error.response.data.message.startsWith('API rate limit exceeded')
//       ) {
//         console.log(
//           'Rate limit exceeded for non-oauth. Switching to oauth.'
//         )
//         return window
//           .fetch(`${process.env.REACT_APP_NOW}/gist/${id}`)
//           .then(response => {
//             console.log({ response })
//             return response.json()
//           })
//       } else {
//         throw error
//       }
//     }
//   )
//   .then(json => dispatch(actions.fetchGistSuccess(json)))
//   .catch(error =>
//     throwError({
//       error,
//       message: `Could not fetch gist ${id} from GitHub while not using an oauth token, or from the hosted oauth service.`
//     })
//   )
// }
