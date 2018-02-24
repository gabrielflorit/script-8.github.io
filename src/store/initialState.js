import screenTypes from '../utils/screenTypes.js'

const initialState = {
  screen: screenTypes.BOOT,
  booted: false,
  gist: {},
  game: 'hey there'
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
