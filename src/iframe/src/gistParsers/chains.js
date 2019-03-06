import _ from 'lodash'
import initialState from '../store/initialState.js'

const extractGistChains = data =>
  JSON.parse(
    _.get(
      data,
      'files["chains.json"].content',
      JSON.stringify(initialState.chains, null, 2)
    )
  )

export { extractGistChains }
