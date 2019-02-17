import _ from 'lodash'
import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'
import screenTypes from '../utils/screenTypes.js'
import runningSum from '../utils/runningSum.js'
import blank from '../iframe/src/blank.js'

const parseGistGame = data => {
  const misc = JSON.parse(_.get(data, 'files["misc.json"].content', '{}'))
  const content = _.get(data, 'files["code.js"].content', '')
  if (misc.lines) {
    const ranges = runningSum(misc.lines)
    const contentLines = content.split('\n')
    return ranges.reduce(
      (acc, cur, idx) => ({
        ...acc,
        [idx]: contentLines.slice(...cur).join('\n')
      }),
      {}
    )
  } else {
    return { 0: content }
  }
}

const game = handleActions(
  {
    [actionTypes.NEW_GAME]: (state, action) =>
      action.payload === screenTypes.CODE
        ? { 0: 'SCRIPT-8 NEW' }
        : { 0: blank },
    [actionTypes.UPDATE_GAME]: (state, { payload }) => ({
      ...state,
      [payload.tab]: payload.content
    }),
    [actionTypes.FETCH_GIST_SUCCESS]: (state, action) =>
      parseGistGame(action.payload)
  },
  initialState.game
)

export default game
export { parseGistGame }
