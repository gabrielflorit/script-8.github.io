import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../iframe/src/store/initialState.js'

const token = handleActions(
  {
    [actionTypes.CLEAR_TOKEN]: () => initialState.token,
    [actionTypes.TOKEN_REQUEST]: () => ({
      isFetching: true
    }),
    [actionTypes.TOKEN_SUCCESS]: (state, action) => ({
      value: action.payload.token,
      user: action.payload.user
    })
  },
  initialState.token
)

export default token
