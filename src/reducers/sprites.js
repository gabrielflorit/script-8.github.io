import omitEmpty from 'omit-empty'
import { handleActions } from 'redux-actions'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../iframe/src/store/initialState.js'
import { extractGistSprites } from '../iframe/src/gistParsers/sprites.js'

const sprites = handleActions(
  {
    [actionTypes.NEW_GAME]: () => initialState.sprites,
    [actionTypes.FETCH_GIST_SUCCESS]: (state, action) =>
      extractGistSprites(action.payload),
    [actionTypes.UPDATE_SPRITE]: (state, { payload }) => {
      const { sprite } = payload
      return omitEmpty({
        ...state,
        [payload.index]:
          sprite && sprite.slice(0, 8).filter(d => d !== '        ').length
            ? sprite
            : null
      })
    }
  },
  initialState.sprites
)

export default sprites
