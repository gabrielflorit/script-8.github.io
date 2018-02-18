import { createActions } from 'redux-actions'
import actionTypes from './actionTypes.js'

const actions = createActions({
  [actionTypes.INPUT_TERMINAL_COMMAND]: input => input,
  [actionTypes.CLEAR_TERMINAL]: () => {}
})

export default actions
