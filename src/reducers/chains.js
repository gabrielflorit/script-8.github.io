import _ from 'lodash'
import omitEmpty from 'omit-empty'
import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const extractGistChains = data =>
  JSON.parse(
    _.get(
      data,
      'files["chains.json"].content',
      JSON.stringify(initialState.chains, null, 2)
    )
  )

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

export { extractGistChains }
