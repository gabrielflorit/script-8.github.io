import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const gist = handleActions(
  {
    [actionTypes.FETCH_GIST_REQUEST]: () => ({
      isFetching: true
    }),
    [actionTypes.FETCH_GIST_SUCCESS]: (state, action) => ({
      isFetching: false,
      data: action.payload
    }),
    [actionTypes.SAVE_GIST_REQUEST]: () => ({
      isFetching: true
    }),
    [actionTypes.SAVE_GIST_SUCCESS]: (state, action) => ({
      isFetching: false,
      data: action.payload
    })
  },
  initialState.gist
)

export default gist
