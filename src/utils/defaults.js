import _ from 'lodash'
import settings from './settings.js'

const defaults = {
  phrase: [],
  chain: _.range(settings.matrixLength).map(() =>
    _.range(settings.chainChannels).map(() => null)
  ),
  song: _.range(settings.matrixLength).map(() => null)
}

export default defaults
