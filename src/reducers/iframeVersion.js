import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../iframe/src/store/initialState.js'
import { parseGistIframeVersion } from '../iframe/src/gistParsers/iframeVersion.js'

const iframeVersion = handleActions(
  {
    [actionTypes.NEW_GAME]: () => initialState.iframeVersion,

    [actionTypes.FETCH_GIST_SUCCESS]: (state, action) =>
      parseGistIframeVersion(action.payload)
  },
  initialState.iframeVersion
)

export default iframeVersion
