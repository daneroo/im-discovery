const swarm = require('discovery-swarm')

const sw = swarm()

sw.listen(1000)
sw.join('scrobbleCast') // can be any id/name/hash

sw.on('connection', function (connection) {
  console.log('found + connected to peer', connection)
})
