import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../iframe/src/store/initialState.js'

const dismissedNotices = handleActions(
  {
    [actionTypes.DISMISS_NOTICES]: (state, { payload }) => [...payload]
  },
  initialState.dismissedNotices
)

export default dismissedNotices
