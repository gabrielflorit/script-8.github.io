import { createActions } from 'redux-actions'
import actionTypes from './actionTypes.js'
import commands from '../utils/commands.js'

const actions = createActions({
  [actionTypes.INPUT_TERMINAL_COMMAND]: (input, history) => {
    // Get the corresponding command.
    const command = commands.find(input)

    if (command && command.name === 'edit') {
      history && history.push('/editor')
    }

    return input
  },
  [actionTypes.CLEAR_TERMINAL]: () => {}
})

export default actions
