import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../iframe/src/store/initialState.js'

const sound = handleActions(
  {
    [actionTypes.TOGGLE_SOUND]: (state, action) => !state
  },
  initialState.sound
)

export default sound
