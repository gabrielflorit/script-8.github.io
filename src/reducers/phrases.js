import _ from 'lodash'
import omitEmpty from 'omit-empty'
import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../iframe/src/store/initialState.js'
import { extractGistPhrases } from '../iframe/src/gistParsers/phrases.js'

const phrases = handleActions(
  {
    [actionTypes.NEW_GAME]: () => initialState.phrases,
    [actionTypes.FETCH_GIST_SUCCESS]: (state, action) =>
      extractGistPhrases(action.payload),
    [actionTypes.UPDATE_PHRASE]: (state, { payload }) => {
      const { index, phrase } = payload
      return omitEmpty({
        ...state,
        [index]:
          phrase &&
          !_.isEmpty(phrase.notes) &&
          Object.values(phrase.notes).filter(d => !_.isNil(d)).length
            ? phrase
            : null
      })
    }
  },
  initialState.phrases
)

export default phrases
