import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../iframe/src/store/initialState.js'

const tutorial = handleActions(
  {
    [actionTypes.CLOSE_TUTORIAL]: () => null,
    [actionTypes.SET_TUTORIAL_SLIDE]: (state, action) => action.payload
  },
  initialState.tutorial
)

export default tutorial
