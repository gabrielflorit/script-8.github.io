import range from 'lodash/range'
import settings from './settings.js'

const defaults = {
  phrase: {
    notes: range(settings.matrixLength).map(d => null),
    volumes: range(settings.matrixLength).map(d => 0)
  },
  chain: range(settings.matrixLength).map(() => range(4).map(() => null))
}

export default defaults
