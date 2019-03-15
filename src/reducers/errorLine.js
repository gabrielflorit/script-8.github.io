import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../iframe/src/store/initialState.js'

const errorLine = handleActions(
  {
    [actionTypes.SET_ERROR_LINE]: (state, action) => action.payload
  },
  initialState.errorLine
)

export default errorLine
