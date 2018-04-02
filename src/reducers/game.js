import _ from 'lodash'
import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'
import screenTypes from '../utils/screenTypes.js'

const parseGistGame = data => _.get(data, 'files["code.js"].content', '')

const game = handleActions(
  {
    [actionTypes.NEW_GAME]: (state, action) =>
      // If the current game is NOT blank,
      // and we're on the CODE screen,
      // return the SCRIPT-8 NEW keyword.
      state !== '' && action.payload === screenTypes.CODE ? 'SCRIPT-8 NEW' : '',
    [actionTypes.UPDATE_GAME]: (state, action) => action.payload,
    [actionTypes.FETCH_GIST_SUCCESS]: (state, action) =>
      parseGistGame(action.payload)
  },
  initialState.game
)

export default game
export { parseGistGame }
