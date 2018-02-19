import makeOutput from '../utils/makeOutput.js'
import demo from '../utils/editorDemo.js'

const initialState = {
  terminalHistory: [
    {
      output: makeOutput('help')
    }
  ],
  game: demo
}

export default initialState
