import _ from 'lodash'
import omitEmpty from 'omit-empty'
import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'

const extractGistRooms = data =>
  JSON.parse(
    _.get(
      data,
      'files["rooms.json"].content',
      JSON.stringify(initialState.rooms, null, 2)
    )
  )

const rooms = handleActions(
  {
    [actionTypes.NEW_GAME]: () => initialState.rooms,
    [actionTypes.FETCH_GIST_SUCCESS]: (state, action) =>
      extractGistRooms(action.payload),
    [actionTypes.UPDATE_ROOM]: (state, { payload }) => {
      const { room, index } = payload
      console.log({ room, index, state })
      // return state
      return {
        ...state,
        [index]: room && room.filter(row => row.length).length ? room : null
      }
    }
  },
  initialState.rooms
)

export default rooms

export { extractGistRooms }
