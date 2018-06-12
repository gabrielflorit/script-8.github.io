const chokidar = require('chokidar')
const WebSocket = require('ws')
const fs = require('fs')

const wss = new WebSocket.Server({ port: 8989 })

wss.on('connection', ws => {
  console.log('client connected')

  ws.on('error', error => console.log(error.code))

  ws.on('close', () => console.log('client disconnected'))
})

if (!process.argv[2]) {
  console.error('Please specify a directory.')
  process.exit(1)
}
const dir = `${process.argv[2]}/*.*`
console.log(`Watching ${dir}`)
chokidar.watch(dir).on('change', path => {
  console.log(path)
  const str = fs.readFileSync(path, 'utf8').replace(/\/\* eslint.*\*\/\n/, '')

  console.log(str)
  wss.clients.forEach(client => {
    client.send(str)
  })
})
