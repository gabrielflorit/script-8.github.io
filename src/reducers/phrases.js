import _ from 'lodash'
import omitEmpty from 'omit-empty'
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
    [actionTypes.UPDATE_PHRASE]: (state, { payload }) =>
      omitEmpty({
        ...state,
        [payload.index]: payload.phrase
      })
  },
  initialState.phrases
)

export default phrases

export { parseGistPhrases }
