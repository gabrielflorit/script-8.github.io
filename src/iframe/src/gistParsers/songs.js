import _ from 'lodash'
import initialState from '../store/initialState.js'

const extractGistSongs = data =>
  JSON.parse(
    _.get(
      data,
      'files["songs.json"].content',
      JSON.stringify(initialState.songs, null, 2)
    )
  )

export { extractGistSongs }
