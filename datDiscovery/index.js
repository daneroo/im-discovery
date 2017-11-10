const swarm = require('discovery-swarm')

const start = +new Date()
const topic = 'imetrical' // can be any id/name/hash
const sw = swarm()
// sw.leave()
// sw.listen(8989) // Listen on a specific port. Should be called before add

log(`Started swarm, joining topic ${topic}`)
sw.join(topic)

sw.on('connection', function (connection, info) {
  console.log('found + connected to peer', pretty(info))
  /* const clear = */ setInterval(() => {
    connection.write(`ping:${short(sw.id)}`)
  }, 2000)
  connection.on('data', function (data) {
    log(`got ${data}`)
    // if (data=='ping'){
    //   log(`sending pong`)
    //   connection.write('pong')
    // }
  })
})

// -- Utilities ------
function log (...args) {
  const elapsed = Math.floor((+new Date() - start) / 1000)
  console.log(new Date().toISOString(), `+${elapsed}`, {id: short(sw.id)}, ...args)
}

function short (id) {
  return id.toString('hex').substr(0, 6)
}

function pretty (info) {
  if (info.channel) {
    console.log('  channel:', info.channel.toString())
  }
  return [info.host, info.port, short(info.id)].join(':')
}
