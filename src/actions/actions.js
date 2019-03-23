import { createActions } from 'redux-actions'
import GitHub from 'github-api'
import _ from 'lodash'
import actionTypes from './actionTypes.js'
import screenTypes from '../iframe/src/utils/screenTypes.js'
import { compressPhrases } from '../iframe/src/gistParsers/phrases.js'
import throwError from '../utils/throwError.js'
import { assembleMiscLines } from '../reducers/game.js'
import {
  parseGistGame,
  assembleOrderedGame
} from '../iframe/src/gistParsers/game.js'

const actions = createActions({
  [actionTypes.UPDATE_IFRAME_VERSION]: () => {},
  [actionTypes.SET_ERROR_LINE]: d => d,
  [actionTypes.CLEAR_TOKEN]: () => {},
  [actionTypes.SELECT_UI]: d => d,
  [actionTypes.DISMISS_NOTICES]: d => d,
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
  [actionTypes.SET_VISIBILITY_REQUEST]: d => d,
  [actionTypes.SET_VISIBILITY_SUCCESS]: d => d,
  [actionTypes.COUNTER_CASSETTE_REQUEST]: () => {},
  [actionTypes.COUNTER_CASSETTE_SUCCESS]: d => d,
  [actionTypes.SET_SCROLL_DATA]: d => d,
  [actionTypes.SET_CODE_TAB]: d => d,
  [actionTypes.UPDATE_HISTORY]: d => d
})

export default actions

export const counterCassette = ({ id }) => dispatch => {
  dispatch(actions.counterCassetteRequest())

  return window
    .fetch(`${process.env.REACT_APP_NOW}/counter/${id}`)
    .then(response => response.json())
    .then(json => dispatch(actions.counterCassetteSuccess(json)))
    .catch(error =>
      throwError({
        error,
        message: `Could not increase counter from the hosted oauth service.`
      })
    )
}

export const setVisibility = ({ token, gistId, isPrivate }) => dispatch => {
  dispatch(actions.setVisibilityRequest())

  return window
    .fetch(`${process.env.REACT_APP_NOW}/set-visibility`, {
      method: 'POST',
      body: JSON.stringify({
        token: token.value,
        gist: gistId,
        isPrivate
      })
    })
    .then(
      response => response.json(),
      error =>
        throwError({
          error,
          message: `Could not set visibility.`
        })
    )
    .then(() => dispatch(actions.setVisibilitySuccess()))
}

export const putOnShelf = ({
  user,
  gist,
  cover,
  title,
  isFork,
  isPrivate,
  token
}) => dispatch => {
  dispatch(actions.shelveCassetteRequest())

  return window
    .fetch(`${process.env.REACT_APP_NOW}/cassette`, {
      method: 'POST',
      body: JSON.stringify({
        user,
        gist,
        cover,
        title,
        isFork,
        isPrivate,
        token: token.value
      })
    })
    .then(
      response => response.json(),
      error =>
        throwError({
          error,
          message: `Could not post cassette via appspot service.`
        })
    )
    .then(() => dispatch(actions.shelveCassetteSuccess()))
    .then(() => dispatch(actions.setScreen(screenTypes.SHELF)))
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
      .then(response => response.json())
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
  iframeVersion,
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
    const README = `This is a [SCRIPT-8](https://script-8.github.io) cassette.${link}`

    const miscJson = {
      iframeVersion
    }

    let payload = {
      public: true,
      description: 'SCRIPT-8',
      files: {
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
          content: README
        }
      }
    }

    const gistGame = parseGistGame(gist.data)
    const assembledGistGame = assembleOrderedGame(gistGame)
    const assembledGame = assembleOrderedGame(game)

    // If game has length, send it.
    if (assembledGame.length) {
      payload.files['code.js'] = {
        content: assembledGame
      }
      miscJson.lines = assembleMiscLines(game)
    } else {
      // So the game has no length.
      // But if the previous gist had game,
      // send 'code.js': null.
      if (assembledGistGame.length) {
        payload.files['code.js'] = null
      }
    }

    payload.files['misc.json'] = {
      content: JSON.stringify(miscJson, null, 2)
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

  const forkGist = () =>
    gh
      .getGist(gist.data.id)
      .fork()
      .then(response => response.data.id)
      .then(id => gh.getGist(id).read())
      .then(response => response.data)
      .then(data => dispatch(actions.saveGistSuccess(data)))
      .catch(error =>
        throwError({
          error,
          message: `Could not fork gist ${
            gist.data.id
          } from the hosted oauth service.`
        })
      )

  // If there is no gist, create it.
  if (!gist.data) {
    return createGist()
  } else if (toBlank) {
    // If we want to record to blank,
    // if it's ours, create a new one.
    if (_.get(gist, 'data.owner.login', null) === token.user.login) {
      return createGist()
    } else {
      // If it's not ours, fork it.
      return forkGist()
    }
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
