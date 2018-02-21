import { combineReducers } from 'redux'
import screen from './screen.js'
import gist from './gist.js'
// import game from './game.js'
// import token from './token.js'
// import nextAction from './nextAction.js'

const reducer = combineReducers({
  screen,
  gist

  // game,
  // token,
  // nextAction
})

export default reducer
