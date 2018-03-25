import _ from 'lodash'
import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const parseGistSongs = data =>
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
      parseGistSongs(action.payload),
    [actionTypes.UPDATE_SONG]: (state, { payload }) => {
      const { song, index } = payload
      const songs =
        state.length > index
          ? [...state]
          : state.concat([...Array(index + 1 - state.length)].map(d => null))

      return [...songs.slice(0, index), song, ...songs.slice(index + 1)]
    }
  },
  initialState.songs
)

export default songs

export { parseGistSongs }
