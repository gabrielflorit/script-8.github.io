import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'
import makeOutput from '../utils/makeOutput.js'
import commands from '../utils/commands.js'

const terminalHistory = handleActions(
  {
    [actionTypes.CLEAR_TERMINAL]: (state, action) => [],
    [actionTypes.INPUT_TERMINAL_COMMAND]: (state, { payload }) => {
      // Get the corresponding command.
      const command = commands.find(payload)

      // Try to get the command's new state.
      const options = {
        clear: []
      }

      const defaultState = [
        ...state,
        {
          input: payload,
          output: makeOutput(payload)
        }
      ]

      return (command && options[command.name]) || defaultState
    }
  },
  initialState.terminalHistory
)

export default terminalHistory
