import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App.js'
import store from './store/store.js'

window.script8 = window.script8 || {}

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
