import omitEmpty from 'omit-empty'
import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../iframe/src/store/initialState.js'
import { extractGistSongs } from '../iframe/src/gistParsers/songs.js'

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
