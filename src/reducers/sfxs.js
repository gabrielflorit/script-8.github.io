import _ from 'lodash'
import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const sfxs = handleActions(
  {
    [actionTypes.NEW_GAME]: () => initialState.sfxs,
    [actionTypes.FETCH_GIST_SUCCESS]: (state, action) =>
      JSON.parse(
        _.get(
          action.payload,
          'files["sfxs.json"].content',
          JSON.stringify(initialState.sfxs, null, 2)
        )
      ),
    [actionTypes.UPDATE_SFX]: (state, { payload }) => [
      ...state.slice(0, payload.index),
      payload.sfx,
      ...state.slice(payload.index + 1)
    ]
  },
  initialState.sfxs
)

export default sfxs
