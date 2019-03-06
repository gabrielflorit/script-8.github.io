import _ from 'lodash'
import initialState from '../store/initialState.js'

const extractGistSprites = data =>
  JSON.parse(
    _.get(
      data,
      'files["sprites.json"].content',
      JSON.stringify(initialState.sprites, null, 2)
    )
  )
export { extractGistSprites }
