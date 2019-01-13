import screenTypes from '../utils/screenTypes.js'
import blank from '../utils/blank.js'

const initialState = {
  screen: screenTypes.BOOT,
  // screen: screenTypes.CODE,
  booted: false,
  gist: {},
  game: blank,
  token: {},
  nextAction: null,
  sfxs: [],
  sprites: {},
  map: [],
  phrases: {},
  chains: {},
  songs: {},
  tutorial: null,
  sound: false,
  shelving: false
}

export default initialState
