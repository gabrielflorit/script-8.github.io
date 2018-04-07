import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const tutorial = handleActions(
  {
    [actionTypes.SET_TUTORIAL]: (state, action) => action.payload
  },
  initialState.tutorial
)

export default tutorial
