import { combineReducers } from 'redux'
import screen from './screen.js'
import gist from './gist.js'
import booted from './booted.js'
import game from './game.js'
import token from './token.js'
import nextAction from './nextAction.js'
import sfx from './sfx.js'

const reducer = combineReducers({
  screen,
  gist,
  booted,
  token,
  game,
  nextAction,
  sfx
})

export default reducer
