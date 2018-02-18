import { createStore } from 'redux'
import reducer from '../reducers/reducer.js'

const store = createStore(reducer)

export default store
