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
      return _.omitBy(
        {
          ...state,
          [index]: _.omitBy(song, _.isNull)
        },
        _.isEmpty
      )
    }
  },
  initialState.songs
)

export default songs

export { parseGistSongs }
