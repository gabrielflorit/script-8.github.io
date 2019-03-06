import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../iframe/src/store/initialState.js'

const booted = handleActions(
  {
    [actionTypes.FINISH_BOOT]: (state, action) => true
  },
  initialState.booted
)

export default booted
