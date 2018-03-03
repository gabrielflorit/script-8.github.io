const chokidar = require('chokidar')
const WebSocket = require('ws')
const fs = require('fs')

const wss = new WebSocket.Server({ port: 8989 })

wss.on('connection', ws => {
  console.log('client connected')
  ws.on('close', () => console.log('client disconnected'))
})

chokidar.watch('game/*.*').on('change', path => {
  console.log(path)
  const str = fs.readFileSync(path, 'utf8')
  console.log(str)
  wss.clients.forEach(client => {
    client.send(str)
  })
})
