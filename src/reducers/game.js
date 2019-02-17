// TODO: add misc lines to store and save to gist

import _ from 'lodash'
import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'
import screenTypes from '../utils/screenTypes.js'
import runningSum from '../utils/runningSum.js'
import blank from '../iframe/src/blank.js'

const assembleOrderedGame = game =>
  _(game)
    .orderBy((value, key) => key)
    .map('text')
    .filter(d => !_.isEmpty(d))
    .value()
    .join('\n')

const getActive = game => ({
  ...game[Object.keys(game).filter(key => game[key].active)],
  key: Object.keys(game).filter(key => game[key].active)[0]
})

const parseGistGame = data => {
  const misc = JSON.parse(_.get(data, 'files["misc.json"].content', '{}'))
  const content = _.get(data, 'files["code.js"].content', '')
  if (misc.lines) {
    const ranges = runningSum(misc.lines)
    const contentLines = content.split('\n')
    return ranges.reduce(
      (acc, cur, idx) => ({
        ...acc,
        [idx]: {
          text: contentLines.slice(...cur).join('\n')
        }
      }),
      {}
    )
  } else {
    return {
      0: {
        text: content
      }
    }
  }
}

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
    [actionTypes.FETCH_GIST_SUCCESS]: (state, action) =>
      parseGistGame(action.payload)
  },
  initialState.game
)

export default game
export { parseGistGame, getActive, assembleOrderedGame }
