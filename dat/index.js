const swarm = require('discovery-swarm')

const sw = swarm()

// sw.listen(8989) // Listen on a specific port. Should be called before add

sw.join('scrobbleCast') // can be any id/name/hash

function pretty (info) {
  if (info.channel) {
    console.log('  channel:', info.channel.toString())
  }
  return [info.host, info.port, info.id.toString('hex')].join(':')
}
sw.on('connection', function (connection, info) {
  console.log('found + connected to peer', pretty(info))
})
