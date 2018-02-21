import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const game = handleActions(
  {
    [actionTypes.UPDATE_GAME]: (state, action) => action.payload
  },
  initialState.game
)

export default game
