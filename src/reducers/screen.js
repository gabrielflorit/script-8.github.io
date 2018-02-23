import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const screen = handleActions(
  {
    [actionTypes.SET_SCREEN]: (state, action) => action.payload
  },
  initialState.screen
)

export default screen
