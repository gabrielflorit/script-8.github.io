import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from './../store/initialState.js'
import makeOutput from './../utils/makeOutput.js'

const terminalHistory = handleActions(
  {
    [actionTypes.CLEAR_TERMINAL]: (state, action) => [],
    [actionTypes.INPUT_TERMINAL_COMMAND]: (state, { payload }) => {
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

      return options[payload] || defaultState
    }
  },
  initialState.terminalHistory
)

export default terminalHistory
