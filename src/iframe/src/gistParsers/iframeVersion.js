import _ from 'lodash'
import initialState from '../store/initialState.js'

// If `data` exists,
//   if `misc.json` has iframeVersion, return it,
//   if it doesn't have it, return 0.1.247
// If `data` doesn't exist,
//   return initialState.iframeVersion.
const parseGistIframeVersion = data => {
  const iframeVersion = data
    ? _.get(
        JSON.parse(_.get(data, 'files["misc.json"].content', '{}')),
        'iframeVersion',
        '0.1.247'
      )
    : initialState.iframeVersion
  return iframeVersion
}

export { parseGistIframeVersion }
