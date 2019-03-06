import * as Tone from 'tone'
import { handleActions } from 'redux-actions'
import includes from 'lodash/includes'
import screenTypes from '../iframe/src/utils/screenTypes.js'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../iframe/src/store/initialState.js'

const screen = handleActions(
  {
    [actionTypes.SET_SCREEN]: (state, action) => {
      if (
        includes(
          [
            screenTypes.PHRASE,
            screenTypes.CHAIN,
            screenTypes.SONG,
            screenTypes.RUN
          ],
          action.payload
        )
      ) {
        if (
          Tone &&
          Tone.context &&
          Tone.context.state &&
          Tone.context.state !== 'running'
        ) {
          Tone.start()
        }
      }
      return action.payload
    }
  },
  initialState.screen
)

export default screen
