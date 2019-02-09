import { combineReducers } from 'redux'
import screen from './screen.js'
import gist from './gist.js'
import booted from './booted.js'
import game from './game.js'
import token from './token.js'
import nextAction from './nextAction.js'
import sfxs from './sfxs.js'
import sprites from './sprites.js'
import map from './map.js'
import phrases from './phrases.js'
import chains from './chains.js'
import songs from './songs.js'
import tutorial from './tutorial.js'
import sound from './sound.js'
import shelving from './shelving.js'
import scrollInfo from './scrollInfo.js'

const reducer = combineReducers({
  screen,
  gist,
  booted,
  token,
  game,
  nextAction,
  sfxs,
  sprites,
  map,
  phrases,
  chains,
  songs,
  tutorial,
  sound,
  shelving,
  scrollInfo
})

export default reducer
