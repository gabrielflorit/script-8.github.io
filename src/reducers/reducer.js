import { combineReducers } from 'redux'
import terminalHistory from './terminalHistory.js'
import screen from './screen.js'

const reducer = combineReducers({
  terminalHistory,
  screen
})

export default reducer
