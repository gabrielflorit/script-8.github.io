import { createActions } from 'redux-actions'
import GitHub from 'github-api'
import _ from 'lodash'
import actionTypes from './actionTypes.js'
import { compressPhrases } from '../reducers/phrases.js'

const actions = createActions({
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
  [actionTypes.UPDATE_PHRASE]: d => d,
  [actionTypes.UPDATE_CHAIN]: d => d,
  [actionTypes.UPDATE_SONG]: d => d,
  [actionTypes.SET_TUTORIAL]: d => d
})

export default actions

const throwError = ({ error, message }) => {
  error.message = [error.message, message].join('. ')
  throw new Error(error)
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
            message: `Could not fetch gist ${id} from GitHub.`
          })
      )
      .then(json => dispatch(actions.fetchGistSuccess(json)))
  } else {
    return window
      .fetch(`https://my-service-pyccaoirrn.now.sh/${id}`)
      .then(
        response => response.json(),
        error =>
          throwError({
            error,
            message: `Could not fetch gist ${id} via now.sh service.`
          })
      )
      .then(json => dispatch(actions.fetchGistSuccess(json)))
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
  game,
  token,
  gist,
  sfxs,
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
      files: _.omitBy(
        {
          'code.js': {
            content: game
          },
          'phrases.json': {
            content: _.isEmpty(phrases)
              ? null
              : JSON.stringify(compressPhrases(phrases), null, 2)
          },
          'chains.json': {
            content: _.isEmpty(chains) ? null : JSON.stringify(chains, null, 2)
          },
          'songs.json': {
            content: _.isEmpty(songs) ? null : JSON.stringify(songs, null, 2)
          },
          'sfxs.json': {
            content: _.isEmpty(sfxs) ? null : JSON.stringify(sfxs, null, 2)
          },
          'README.md': {
            content
          }
        },
        d => _.isNil(d.content) || _.isEmpty(d.content)
      )
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

  // If there is no gist, create it.
  if (!gist.data) {
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
