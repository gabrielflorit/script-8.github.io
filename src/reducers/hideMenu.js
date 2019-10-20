import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../iframe/src/store/initialState.js'

const hideMenu = handleActions(
  {
    [actionTypes.TOGGLE_MENU]: (state, action) => !state
  },
  initialState.hideMenu
)

export default hideMenu
