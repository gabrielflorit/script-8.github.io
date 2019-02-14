import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const codeTab = handleActions(
  {
    [actionTypes.NEW_GAME]: () => initialState.codeTab,
    [actionTypes.SET_CODE_TAB]: (state, action) => action.payload
  },
  initialState.codeTab
)

export default codeTab
