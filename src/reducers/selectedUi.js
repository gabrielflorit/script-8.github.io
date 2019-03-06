import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../iframe/src/store/initialState.js'

const selectedUi = handleActions(
  {
    [actionTypes.SELECT_UI]: (state, { payload }) => ({
      ...payload
    })
  },
  initialState.selectedUi
)

export default selectedUi
