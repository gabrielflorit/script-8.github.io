import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const scrollInfo = handleActions(
  {
    [actionTypes.SET_SCROLL_INFO]: (state, action) => action.payload
  },
  initialState.scrollInfo
)

export default scrollInfo
