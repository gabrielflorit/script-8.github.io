import { combineReducers } from 'redux'
import terminalHistory from './terminalHistory.js'
import game from './game.js'
import token from './token.js'
import gist from './gist.js'
import nextAction from './nextAction.js'

const reducer = combineReducers({
  terminalHistory,
  game,
  token,
  gist,
  nextAction
})

export default reducer
