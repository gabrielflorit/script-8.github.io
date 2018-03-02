import screenTypes from '../utils/screenTypes.js'
import demo from '../utils/demo.js'

const initialState = {
  // screen: screenTypes.SFX,
  screen: screenTypes.BOOT,
  booted: false,
  gist: {},
  game: demo,
  token: {},
  nextAction: null,
  sfx: {
    bars: [1, 2, 3, 5, 8, 5, 3, 2]
  }
}

export default initialState
