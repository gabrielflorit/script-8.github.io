import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../iframe/src/store/initialState.js'

const shelving = handleActions(
  {
    [actionTypes.SHELVE_CASSETTE_REQUEST]: () => true,
    [actionTypes.SHELVE_CASSETTE_SUCCESS]: () => false,
    [actionTypes.SET_VISIBILITY_REQUEST]: () => true,
    [actionTypes.SET_VISIBILITY_SUCCESS]: () => false
  },
  initialState.shelving
)

export default shelving
