import _ from 'lodash'
import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const game = handleActions(
  {
    [actionTypes.NEW_GAME]: (state, action) => 'SCRIPT-8 NEW',
    [actionTypes.UPDATE_GAME]: (state, action) => action.payload,
    [actionTypes.FETCH_GIST_SUCCESS]: (state, action) =>
      _.get(action.payload, 'files["code.js"].content', null)
  },
  initialState.game
)

export default game
