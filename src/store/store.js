import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'
import reducer from '../reducers/reducer.js'
import { loadState, saveState } from './localStorage.js'

const persistedState = loadState()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  reducer,
  persistedState,
  composeEnhancers(applyMiddleware(thunkMiddleware))
)

store.subscribe(() => {
  saveState({
    game: store.getState().game,
    token: store.getState().token
  })
})

export default store
