import range from 'lodash/range'
import settings from './settings.js'

const defaults = {
  phrase: {
    notes: range(settings.matrixLength).map(d => null),
    volumes: range(settings.matrixLength).map(d => 0)
  },
  chain: range(settings.matrixLength).map(e =>
    range(4).map(d => [e, d, e, d].join('').slice(0, 3))
  )
}

export default defaults
