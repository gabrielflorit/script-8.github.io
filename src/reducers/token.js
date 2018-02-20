Pimport { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const token = handleActions(
  {
    [actionTypes.TOKEN_REQUEST]: () => ({
      isFetching: true
    }),
    [actionTypes.TOKEN_SUCCESS]: (state, action) => ({
      value: action.payload.token
    })
  },
  initialState.token
)

export default token
