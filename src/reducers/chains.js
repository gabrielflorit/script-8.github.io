import _ from 'lodash'
import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const parseGistChains = data =>
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
      parseGistChains(action.payload),
    [actionTypes.UPDATE_CHAIN]: (state, { payload }) => {
      const { chain, index } = payload
      return _.omitBy(
        {
          ...state,
          [index]: _.omitBy(chain, _.isNull)
        },
        _.isEmpty
      )
    }
  },
  initialState.chains
)

export default chains

export { parseGistChains }
