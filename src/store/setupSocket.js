import actions from '../actions/actions.js'

const setupSocket = dispatch => {
  const socket = new window.WebSocket('ws://localhost:8989')
  socket.onmessage = event => {
    dispatch(actions.updateGame(event.data))
  }
}

export default setupSocket
