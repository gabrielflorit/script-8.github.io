import { handleActions } from 'redux-actions'
import _ from 'lodash'
import actionTypes from '../actions/actionTypes.js'
import initialState from '../store/initialState.js'
import tutorialSlides from '../utils/tutorialSlides.js'

const screen = handleActions(
  {
    [actionTypes.SET_SCREEN]: (state, action) => action.payload,
    [actionTypes.SET_TUTORIAL_SLIDE]: (state, action) =>
      _.get(tutorialSlides, [action.payload, 'screen'], state)
  },
  initialState.screen
)

export default screen
