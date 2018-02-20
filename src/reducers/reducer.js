import { combineReducers } from 'redux'
import terminalHistory from './terminalHistory.js'
import game from './game.js'
import token from './token.js'

const reducer = combineReducers({
  terminalHistory,
  game,
  token
})

export default reducer
