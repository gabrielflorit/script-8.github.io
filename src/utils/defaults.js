import range from 'lodash/range'
import settings from './settings.js'

const defaults = {
  phrase: {
    notes: range(settings.matrixLength).map(() => null),
    volumes: range(settings.matrixLength).map(() => 0)
  },
  chain: range(settings.matrixLength).map(() =>
    range(settings.chainChannels).map(() => null)
  ),
  song: range(settings.matrixLength).map(() => null)
}

export default defaults
