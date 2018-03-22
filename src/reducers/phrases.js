import _ from 'lodash'
import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const parseGistPhrases = data =>
  JSON.parse(
    _.get(
      data,
      'files["phrases.json"].content',
      JSON.stringify(initialState.phrases, null, 2)
    )
  )

const phrases = handleActions(
  {
    [actionTypes.NEW_GAME]: () => initialState.phrases,
    [actionTypes.FETCH_GIST_SUCCESS]: (state, action) =>
      parseGistPhrases(action.payload),
    [actionTypes.UPDATE_PHRASE]: (state, { payload }) => {
      const { phrase, index } = payload
      const phrases =
        state.length > index
          ? [...state]
          : state.concat([...Array(index + 1 - state.length)].map(d => null))

      return [
        ...phrases.slice(0, index),
        {
          ...phrases[index],
          ...phrase
        },
        ...phrases.slice(index + 1)
      ]
    }
  },
  initialState.phrases
)

export default phrases

export { parseGistPhrases }
