import _ from 'lodash'
import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const extractGistMap = data =>
  JSON.parse(
    _.get(
      data,
      'files["map.json"].content',
      JSON.stringify(initialState.map, null, 2)
    )
  )

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

export { extractGistMap }
