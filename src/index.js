import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App.js'
import store from './store/store.js'

// window.script8 = window.script8 || {}
localStorage.removeItem('script-8')

render(
  // <Provider store={store}>
  <div className="maintenance">
    <p>
      SCRIPT-8 is undergoing maintenance and will be back soon. In the meantime,
      come join us on the{' '}
      <a className="text" href="https://discord.gg/HA68FNX">
        Fantasy Consoles Discord server
      </a>
      , a friendly place to chat about these sophisticated, cutting-edge
      computers. The server has a dedicated SCRIPT-8 room.
    </p>
    <p>- Gabriel</p>
  </div>,
  // </Provider>,
  document.getElementById('root')
)
