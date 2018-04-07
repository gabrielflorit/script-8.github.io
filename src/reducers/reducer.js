import { combineReducers } from 'redux'
import screen from './screen.js'
import gist from './gist.js'
import booted from './booted.js'
import game from './game.js'
import token from './token.js'
import nextAction from './nextAction.js'
import sfxs from './sfxs.js'
import phrases from './phrases.js'
import chains from './chains.js'
import songs from './songs.js'
import tutorial from './tutorial.js'

const reducer = combineReducers({
  screen,
  gist,
  booted,
  token,
  game,
  nextAction,
  sfxs,
  phrases,
  chains,
  songs,
  tutorial
})

export default reducer
