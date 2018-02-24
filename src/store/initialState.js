import screenTypes from '../utils/screenTypes.js'
import demo from '../utils/demo.js'

const initialState = {
  screen: screenTypes.RUN,
  booted: false,
  gist: {},
  game: demo
}

export default initialState
