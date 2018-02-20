import makeOutput from '../utils/makeOutput.js'
import demo from '../utils/editorDemo.js'
import { version } from '../../package.json'

const initialState = {
  terminalHistory: [
    {
      output: `script-8 ${version}`
    },
    {
      output: makeOutput('help')
    }
  ],
  game: demo
}

export default initialState
