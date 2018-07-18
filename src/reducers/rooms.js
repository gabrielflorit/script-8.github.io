import _ from 'lodash'
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
      const result = _.omitBy(
        {
          ...state,
          [index]:
            room &&
            room.filter(cols => cols.filter(col => col !== null).length).length
              ? room
              : null
        },
        _.isNull
      )
      return result
    }
  },
  initialState.rooms
)

export default rooms

export { extractGistRooms }
