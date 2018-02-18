import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from './initialState.js'

const terminalHistory = handleActions(
  {
    [actionTypes.CLEAR_TERMINAL]: (state, action) => []
    // [actionTypes.INPUT_TERMINAL_COMMAND]: (state, action) => action.payload
  },
  initialState.terminalHistory
)

export default terminalHistory
