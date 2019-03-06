import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../iframe/src/store/initialState.js'

const gist = handleActions(
  {
    [actionTypes.NEW_GAME]: () => {},
    [actionTypes.FETCH_GIST_REQUEST]: () => ({
      isFetching: true
    }),
    [actionTypes.FETCH_GIST_SUCCESS]: (state, action) => ({
      isFetching: false,
      data: action.payload
    }),
    [actionTypes.SAVE_GIST_REQUEST]: state => ({
      data: state.data,
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
