const Room = require('ipfs-pubsub-room')

module.exports = {
  start: start
}

async function start (ipfs, topic) {
  const room = Room(ipfs, topic)
  const id = await ipfs.id()
  const ipfsId = id.id
  const start = +new Date()

  function short (idStr) {
    return idStr.substr(0, 6)
  }

  function log (...args) {
    const elapsed = Math.floor((+new Date() - start) / 1000)
    console.log(new Date().toISOString(), `+${elapsed}`, short(ipfsId), ...args)
  }

  room.on('stop', (message) => { log(`stop::${topic}`) })
  room.on('error', (err) => { log(`error:::${topic}`, err) })
  room.on('warning', (err) => { log(`warning:::${topic}`, err) })
  room.on('subscribed', (topic) => { log('room::subscribed', topic) })

  room.on('peer joined', (id) => { log(`peer joined::${topic}`, short(id)) })
  room.on('peer left', (id) => { log(`peer left::${topic}`, short(id)) })

  room.on('message', (message) => {
    log(`message::${topic} from:${short(message.from)} : ${message.data.toString()}`)
  })

  /* const clearPing =  */ setInterval(() => room.broadcast('ping'), 1000)
  /* const clearPeers = */ setInterval(showPeers, 5000)
  function showPeers () {
    const peers = room.getPeers()
    log(`|peers::${topic}|=${peers.length} [${peers.map(short).join(',')}]`)
  }
  // const leaveAndClear = () => {
  //   log(`Leaving room ${topic}`)
  //   clearTimeout(clearPing)
  //   clearTimeout(clearPeers)
  //   room.leave()
  // }
  // setTimeout(leaveAndClear, 20000)
}
