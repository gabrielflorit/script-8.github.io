import _ from 'lodash'
import omitEmpty from 'omit-empty'
import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const extractGistSongs = data =>
  JSON.parse(
    _.get(
      data,
      'files["songs.json"].content',
      JSON.stringify(initialState.songs, null, 2)
    )
  )

const songs = handleActions(
  {
    [actionTypes.NEW_GAME]: () => initialState.songs,
    [actionTypes.FETCH_GIST_SUCCESS]: (state, action) =>
      extractGistSongs(action.payload),
    [actionTypes.UPDATE_SONG]: (state, { payload }) =>
      omitEmpty({
        ...state,
        [payload.index]: payload.song
      })
  },
  initialState.songs
)

export default songs

export { extractGistSongs }
