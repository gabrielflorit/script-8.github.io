import { createActions } from 'redux-actions'
import actionTypes from './actionTypes.js'
import commands from '../utils/commands.js'

const actions = createActions({
  [actionTypes.INPUT_TERMINAL_COMMAND]: (input, history) => {
    // Get the corresponding command.
    const command = commands.find(input)

    if (command && command.name === 'editor') {
      history && history.push('/editor')
    }

    return input
  },
  [actionTypes.CLEAR_TERMINAL]: () => {},
  [actionTypes.UPDATE_GAME]: game => game,
  [actionTypes.SET_TOKEN]: token => token,
})

export default actions
