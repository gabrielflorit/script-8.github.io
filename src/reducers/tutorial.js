import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const tutorial = handleActions(
  {
    [actionTypes.CLOSE_TUTORIAL]: () => null,
    [actionTypes.SET_TUTORIAL_SLIDE]: (state, action) => action.payload,
    [actionTypes.NEW_GAME]: state => {
      if (state === 2) {
        return state + 1
      }
      return state
    }
  },
  initialState.tutorial
)

export default tutorial
