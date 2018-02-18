import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'
import commands from '../utils/commands.js'

const game = handleActions(
  {
    [actionTypes.CLEAR_TERMINAL]: (state, action) => state,
    [actionTypes.INPUT_TERMINAL_COMMAND]: (state, { payload }) => {
      // Get the corresponding command.
      const command = commands.find(payload)

      let newState = {
        ...state
      }

      if (command && command.name === 'edit') {
        const gameName = payload.match(command.regex)
        newState = {
          name: gameName[1]
        }
      }

      return newState
    }
  },
  initialState.game
)

export default game
