import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const token = handleActions(
  {
    [actionTypes.SET_TOKEN]: (state, action) => action.payload
  },
  initialState.token
)

export default token
