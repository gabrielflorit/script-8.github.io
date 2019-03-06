import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../iframe/src/store/initialState.js'

const docHistories = handleActions(
  {
    [actionTypes.NEW_GAME]: () => initialState.docHistories,
    [actionTypes.UPDATE_HISTORY]: (state, { payload }) => ({
      ...state,
      [payload.index]: payload.history
    })
  },
  initialState.docHistories
)

export default docHistories
