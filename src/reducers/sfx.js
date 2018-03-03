import _ from 'lodash'
import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const sfx = handleActions(
  {
    [actionTypes.NEW_GAME]: () => initialState.sfx,
    [actionTypes.FETCH_GIST_SUCCESS]: (state, action) => {
      const sfx = JSON.parse(
        _.get(action.payload, 'files["sfx.json"].content', '{}')
      )
      return {
        ...state,
        ...sfx
      }
    },
    [actionTypes.UPDATE_SFX]: (state, { payload }) => ({
      ...state,
      ...payload
    })
  },
  initialState.sfx
)

export default sfx
