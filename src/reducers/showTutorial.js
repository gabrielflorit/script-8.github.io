import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const showTutorial = handleActions(
  {
    [actionTypes.SHOW_TUTORIAL]: (state, action) => action.payload
  },
  initialState.showTutorial
)

export default showTutorial
