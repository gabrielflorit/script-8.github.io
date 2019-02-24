import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'
import reducer from '../reducers/reducer.js'
import { loadState, saveState } from './localStorage.js'
import setupSocket from './setupSocket.js'

const persistedState = loadState()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  reducer,
  persistedState,
  composeEnhancers(applyMiddleware(thunkMiddleware))
)

if (process.env.NODE_ENV !== 'production') {
  setupSocket(store.dispatch)
}

store.subscribe(() => {
  saveState({
    token: store.getState().token,
    dismissedNotices: store.getState().dismissedNotices,
    game: store.getState().game,
    sprites: store.getState().sprites,
    map: store.getState().map,
    phrases: store.getState().phrases,
    chains: store.getState().chains,
    songs: store.getState().songs,
  })
})

export default store
