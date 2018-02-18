import makeOutput from './../utils/makeOutput.js'
import screenTypes from './../utils/screenTypes.js'

const initialState = {
  terminalHistory: [
    {
      output: 'Hello. My name is GAM-8. Welcome!'
    },
    {
      output: makeOutput('help')
    }
  ],
  screen: screenTypes.TERMINAL
}

export default initialState