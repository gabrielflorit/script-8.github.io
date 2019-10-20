import { handleActions } from 'redux-actions'
import includes from 'lodash/includes'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../iframe/src/store/initialState.js'
import screenTypes from '../iframe/src/utils/screenTypes.js'

const hideMenu = handleActions(
  {
    [actionTypes.TOGGLE_MENU]: (state, action) => !state,
    [actionTypes.SET_SCREEN]: (state, action) => {
      if (!includes([screenTypes.BOOT, screenTypes.RUN], action.payload)) {
        return false
      } else {
        return state
      }
    }
  },
  initialState.hideMenu
)

export default hideMenu
