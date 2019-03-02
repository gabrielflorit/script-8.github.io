import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const selectedUi = handleActions(
  {
    [actionTypes.SELECT_UI]: (state, { payload }) => ({
      ...payload
    })
  },
  initialState.selectedUi
)

export default selectedUi
