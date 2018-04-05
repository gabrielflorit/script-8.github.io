import screenTypes from '../utils/screenTypes.js'
import demo from '../utils/demo.js'

const initialState = {
  // screen: screenTypes.CHAIN,
  // screen: screenTypes.PHRASE,
  // screen: screenTypes.SONG,
  screen: screenTypes.BOOT,
  // screen: screenTypes.CODE,
  // screen: screenTypes.HELP,
  booted: false,
  gist: {},
  game: demo,
  token: {},
  nextAction: null,
  sfxs: [],
  phrases: {},
  chains: {},
  songs: {},
  showTutorial: false
}

export default initialState
