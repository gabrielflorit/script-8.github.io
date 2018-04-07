import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const newUser = handleActions(
  {
    [actionTypes.IS_NEW_USER]: () => true,
    [actionTypes.CLOSE_TUTORIAL]: () => false
  },
  initialState.newUser
)

export default newUser
