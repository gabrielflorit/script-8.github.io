import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from './../store/initialState.js'
import commands from './../utils/commands.js'
import screenTypes from './../utils/screenTypes.js'

const screen = handleActions(
  {
    [actionTypes.INPUT_TERMINAL_COMMAND]: (state, { payload }) => {
      // Get the corresponding command.
      const command = commands.find(payload)

      // Try to get the command's new state.
      const options = {
        edit: screenTypes.EDITOR
      }

      return (command && options[command.name]) || state
    }
  },
  initialState.screen
)

export default screen
