import _ from 'lodash'
import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../iframe/src/store/initialState.js'
import screenTypes from '../iframe/src/utils/screenTypes.js'
import blank from '../iframe/src/blank.js'
import { parseGistGame } from '../iframe/src/gistParsers/game.js'

const assembleMiscLines = game =>
  _.range(8).map(d => {
    if (game[d] && game[d].text) {
      return game[d].text.split('\n').length
    } else {
      return 0
    }
  })

const getActive = game => ({
  ...game[Object.keys(game).filter(key => game[key].active)],
  key: Object.keys(game).filter(key => game[key].active)[0]
})

const game = handleActions(
  {
    [actionTypes.NEW_GAME]: (state, action) =>
      action.payload === screenTypes.CODE
        ? { 0: { text: 'SCRIPT-8 NEW', active: true, key: 0 } }
        : { 0: { text: blank, active: true, key: 0 } },

    [actionTypes.SET_CODE_TAB]: (state, { payload }) =>
      _.mapValues(
        {
          ...state,
          [payload]: { ...state[payload], key: payload, active: true }
        },
        (value, key) => ({
          ...value,
          active: key === payload.toString()
        })
      ),

    [actionTypes.UPDATE_GAME]: (state, { payload }) => ({
      ...state,
      [payload.tab]: {
        ...state[payload.tab],
        text: payload.content
      }
    }),

    [actionTypes.SET_SCROLL_DATA]: (state, { payload }) => ({
      ...state,
      [payload.tab]: { ...state[payload.tab], scrollData: payload.scrollData }
    }),

    [actionTypes.FETCH_GIST_SUCCESS]: (state, action) =>
      parseGistGame(action.payload)
  },
  initialState.game
)

export default game
export { getActive, assembleMiscLines }
