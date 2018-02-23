import screenTypes from '../utils/screenTypes.js'
// import { version } from '../../package.json'

const initialState = {
  screen: screenTypes.BOOT,
  booted: false,
  gist: {},
  game: null
}

export default initialState

// terminalHistory: [
//   {
//     output: `script-8 ${version}`
//   },
//   {
//     output: makeOutput('help')
//   }
// ],
// game: demo,
// gist: {},
// token: {},
// nextAction: null
