import { combineReducers } from 'redux'
import screen from './screen.js'
import gist from './gist.js'
import booted from './booted.js'
import game from './game.js'
import token from './token.js'
import nextAction from './nextAction.js'
import sprites from './sprites.js'
import map from './map.js'
import phrases from './phrases.js'
import chains from './chains.js'
import songs from './songs.js'
import tutorial from './tutorial.js'
import sound from './sound.js'
import shelving from './shelving.js'
import docHistories from './docHistories.js'
import dismissedNotices from './dismissedNotices.js'
import selectedUi from './selectedUi.js'
import errorLine from './errorLine.js'
import iframeVersion from './iframeVersion.js'

const reducer = combineReducers({
  iframeVersion,
  errorLine,
  screen,
  gist,
  booted,
  token,
  game,
  nextAction,
  sprites,
  map,
  phrases,
  chains,
  songs,
  tutorial,
  sound,
  shelving,
  docHistories,
  dismissedNotices,
  selectedUi
})

export default reducer
