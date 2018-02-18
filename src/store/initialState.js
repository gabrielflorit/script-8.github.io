import makeOutput from '../utils/makeOutput.js'

const initialState = {
  terminalHistory: [
    {
      output: 'Hello. My name is GAM-8. Welcome!'
    },
    {
      output: makeOutput('help')
    }
  ]
  // game: {}
}

export default initialState
