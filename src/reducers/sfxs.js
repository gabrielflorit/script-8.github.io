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
    [actionTypes.UPDATE_SFX]: (state, { payload }) => {
      const { sfx, index } = payload
      const sfxs =
        state.length > index
          ? [...state]
          : state.concat([...Array(index + 1 - state.length)].map(d => null))

      return [
        ...sfxs.slice(0, index),
        {
          ...sfxs[index],
          ...sfx
        },
        ...sfxs.slice(index + 1)
      ]
    }
  },
  initialState.sfxs
)

export default sfxs
