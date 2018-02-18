import { createStore } from 'redux'
import reducer from '../reducers/reducer.js'
import { loadState, saveState } from './localStorage.js'

const persistedState = loadState()

const store = createStore(
  reducer,
  persistedState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

store.subscribe(() => {
  saveState({
    game: store.getState().game
  })
})

export default store
