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
  game: demo,
  gist: {},
  token: {
    value: '42573fbda9b80cef90ebc5c25117edc581d416e8'
  }
}

export default initialState
