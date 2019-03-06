import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../iframe/src/store/initialState.js'

const nextAction = handleActions(
  {
    [actionTypes.SET_NEXT_ACTION]: (state, action) => action.payload,
    [actionTypes.CLEAR_NEXT_ACTION]: () => null
  },
  initialState.nextAction
)

export default nextAction
