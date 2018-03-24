import screenTypes from '../utils/screenTypes.js'
import demo from '../utils/demo.js'

const initialState = {
  screen: screenTypes.PHRASE,
  // screen: screenTypes.BOOT,
  booted: false,
  gist: {},
  game: demo,
  token: {},
  nextAction: null,
  sfxs: [],
  phrases: []
}

export default initialState
