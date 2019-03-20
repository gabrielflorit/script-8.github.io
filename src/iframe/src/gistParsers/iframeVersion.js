import _ from 'lodash'
import initialState from '../store/initialState.js'

const parseGistIframeVersion = data =>
  JSON.parse(
    _.get(
      data,
      'files["misc.json"].content.iframeVersion',
      JSON.stringify(initialState.iframeVersion, null, 2)
    )
  )

export { parseGistIframeVersion }
