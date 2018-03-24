import range from 'lodash/range'
import settings from './settings.js'

const defaults = {
  phrase: {
    notes: range(settings.phraseLength).map(d => null),
    volumes: range(settings.phraseLength).map(d => 0)
  }
}

export default defaults
