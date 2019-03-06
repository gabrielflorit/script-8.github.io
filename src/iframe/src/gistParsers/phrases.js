import _ from 'lodash'
import omitEmpty from 'omit-empty'
import initialState from '../store/initialState.js'
import toLetter, { letterToNumber } from '../toLetter.js'

const compressPhrases = phrases => {
  const result = _.mapValues(phrases, phrase => {
    const notes = _.map(phrase.notes, (note, noteIndex) =>
      [noteIndex, toLetter(note.note), note.octave, note.volume].join('')
    )
    return {
      notes,
      tempo: _.isNil(phrase.tempo) ? 0 : phrase.tempo
    }
  })
  return result
}

const expandPhrases = phrases => {
  // `phrases` is an object, e.g. (old style)
  // {
  //   "0": [
  //     "0f17",
  //     "1g17",
  //     "2a17",

  const result = omitEmpty(
    _.mapValues(phrases, phrase => {
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

      return _.isEmpty(notes)
        ? null
        : {
            notes,
            tempo: phraseIsArray ? 0 : _.isNil(phrase.tempo) ? 0 : phrase.tempo
          }
    })
  )

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

export { extractGistPhrases, compressPhrases, expandPhrases }
