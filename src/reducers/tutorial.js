import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const tutorial = handleActions(
  {
    [actionTypes.IS_NEW_USER]: () => 0,
    [actionTypes.CLOSE_TUTORIAL]: () => false,
    [actionTypes.SET_TUTORIAL_SLIDE]: (state, action) => action.payload
  },
  initialState.tutorial
)

export default tutorial
