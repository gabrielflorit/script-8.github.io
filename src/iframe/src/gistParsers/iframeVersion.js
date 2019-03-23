import _ from 'lodash'
import initialState from '../store/initialState.js'

const parseGistIframeVersion = data =>
  _.get(
    JSON.parse(_.get(data, 'files["misc.json"].content', '{}')),
    'iframeVersion',
    '0.1.247'
  )

export { parseGistIframeVersion }
