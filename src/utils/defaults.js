import range from 'lodash/range'
import settings from './settings.js'

const defaults = {
  phrase: {
    notes: range(settings.phraseLength).map(d => d),
    volumes: range(settings.phraseLength).map(d => 7)
  }
}

export default defaults
