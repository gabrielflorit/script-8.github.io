import screenTypes from '../utils/screenTypes.js'
import demo from '../utils/demo.js'

const initialState = {
  // screen: screenTypes.CHAIN,
  // screen: screenTypes.BOOT,
  screen: screenTypes.PHRASE,
  booted: false,
  gist: {},
  game: demo,
  token: {},
  nextAction: null,
  sfxs: [],
  phrases: {},
  chains: [],
  songs: []
}

export default initialState
