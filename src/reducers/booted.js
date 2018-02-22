import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const booted = handleActions(
  {
    [actionTypes.FINISH_BOOT]: (state, action) => true
  },
  initialState.booted
)

export default booted
