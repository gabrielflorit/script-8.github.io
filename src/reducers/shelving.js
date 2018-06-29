import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const shelving = handleActions(
  {
    [actionTypes.SHELVE_CASSETTE_REQUEST]: () => true,
    [actionTypes.SHELVE_CASSETTE_SUCCESS]: () => false,
    [actionTypes.UNSHELVE_CASSETTE_REQUEST]: () => true,
    [actionTypes.UNSHELVE_CASSETTE_SUCCESS]: () => false
  },
  initialState.shelving
)

export default shelving
