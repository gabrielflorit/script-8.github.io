import omitEmpty from 'omit-empty'
import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../iframe/src/store/initialState.js'
import { extractGistChains } from '../iframe/src/gistParsers/chains.js'

const chains = handleActions(
  {
    [actionTypes.NEW_GAME]: () => initialState.chains,
    [actionTypes.FETCH_GIST_SUCCESS]: (state, action) =>
      extractGistChains(action.payload),
    [actionTypes.UPDATE_CHAIN]: (state, { payload }) =>
      omitEmpty({
        ...state,
        [payload.index]: payload.chain
      })
  },
  initialState.chains
)

export default chains
