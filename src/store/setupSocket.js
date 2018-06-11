import actions from '../actions/actions.js'

const setupSocket = dispatch => {
  const socket = new window.WebSocket('ws://localhost:8989')
  socket.addEventListener('message', event => {
    dispatch(actions.updateGame(`//SCRIPT-8 WEBSOCKET\n${event.data}`))
  })
}

export default setupSocket
