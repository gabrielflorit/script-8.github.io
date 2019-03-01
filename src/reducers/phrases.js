import _ from 'lodash'
import omitEmpty from 'omit-empty'
import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'
import toLetter, { letterToNumber } from '../iframe/src/toLetter.js'

const compressPhrases = phrases =>
  _.mapValues(phrases, phrase =>
    _.map(phrase, (note, noteIndex) =>
      [noteIndex, toLetter(note.note), note.octave, note.volume].join('')
    )
  )

const expandPhrases = phrases => {
  // `phrases` is an object, e.g.
  // {
  //   "0": [
  //     "0f17",
  //     "1g17",
  //     "2a17",
  const result = _.mapValues(phrases, phrase => {
    // If phrase is an array, it's an old kind. We have to convert it.
    const phraseIsArray = Array.isArray(phrase)
    const notes = _(phraseIsArray ? phrase : phrase.notes)
      .map(note => note.match(/^(\d+)(.*)(\d)(\d)/).slice(1, 5))
      .map(match => ({
        index: match[0],
        note: letterToNumber(match[1]),
        octave: +match[2],
        volume: +match[3]
      }))
      .keyBy('index')
      .mapValues(d => _.omit(d, 'index'))
      .value()

    return {
      notes,
      rate: phraseIsArray ? 0 : phrase.rate
    }
  })
  console.log({ phrases, result })
  return result
}

const extractGistPhrases = data =>
  expandPhrases(
    JSON.parse(
      _.get(
        data,
        'files["phrases.json"].content',
        JSON.stringify(initialState.phrases, null, 2)
      )
    )
  )

const phrases = handleActions(
  {
    [actionTypes.NEW_GAME]: () => initialState.phrases,
    [actionTypes.FETCH_GIST_SUCCESS]: (state, action) =>
      extractGistPhrases(action.payload),
    [actionTypes.UPDATE_PHRASE]: (state, { payload }) =>
      omitEmpty({
        ...state,
        [payload.index]: payload.phrase
      })
  },
  initialState.phrases
)

export default phrases

export { extractGistPhrases, compressPhrases, expandPhrases }
