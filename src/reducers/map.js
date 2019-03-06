import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../iframe/src/store/initialState.js'
import { extractGistMap } from '../iframe/src/gistParsers/map.js'

const map = handleActions(
  {
    [actionTypes.NEW_GAME]: () => initialState.map,
    [actionTypes.FETCH_GIST_SUCCESS]: (state, action) =>
      extractGistMap(action.payload),
    [actionTypes.UPDATE_MAP]: (state, action) => action.payload
  },
  initialState.map
)

export default map
