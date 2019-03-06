import _ from 'lodash'
import initialState from '../store/initialState.js'

const extractGistMap = data =>
  JSON.parse(
    _.get(
      data,
      'files["map.json"].content',
      JSON.stringify(initialState.map, null, 2)
    )
  )

export { extractGistMap }
