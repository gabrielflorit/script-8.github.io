import makeOutput from '../utils/makeOutput.js'

const initialState = {
  terminalHistory: [
    {
      output: makeOutput('help')
    }
  ],
  game: null
}

export default initialState
