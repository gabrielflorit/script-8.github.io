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
      const chains =
        state.length > index
          ? [...state]
          : state.concat([...Array(index + 1 - state.length)].map(d => null))

      return [
        ...chains.slice(0, index),
        {
          ...chains[index],
          ...chain
        },
        ...chains.slice(index + 1)
      ]
    }
  },
  initialState.chains
)

export default chains

export { parseGistChains }
