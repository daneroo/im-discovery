
const IPFS = require('ipfs')
const IPFSRepo = require('ipfs-repo')
const Room = require('ipfs-pubsub-room')

// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

let ipfsId = 'Qm00000000000'
const start = +new Date()
const repoPath = '/tmp/ipfs-test-' + Math.random().toString().substring(2, 8)
log('repo', repoPath)
const repo = new IPFSRepo(repoPath)

const ipfsOptions = {
  repo: repo,
  config: {
    Addresses: {
      Swarm: [
        '/libp2p-webrtc-star/dns4/star-signal.cloud.ipfs.team/wss'
      ]
    },
    Discovery: {
      webRTCStar: {
        Enabled: true
      }
    }
  },
  EXPERIMENTAL: {
    pubsub: true
  }
}
const ipfs = new IPFS(ipfsOptions)
const topic = 'scrobblcast-room-test'
const room = Room(ipfs, topic)

function short (idStr) {
  return idStr.substr(0, 6)
}
function log (...args) {
  const elapsed = Math.floor((+new Date() - start) / 1000)
  console.log(new Date().toISOString(), `+${elapsed}`, short(ipfsId), ...args)
}

ipfs.on('init', () => { log('init') })

ipfs.once('ready', async () => {
  const id = await ipfs.id()
  ipfsId = id.id
  log('ready')
})

ipfs.on('error', (err) => { log('error', err) })

ipfs.on('start', async () => {     // Node has started
  log('start')
})

ipfs.on('stop', () => {
  log('stop')
})

room.on('stop', (message) => { log('room::stop') })
room.on('error', (err) => { log('room::error', err) })
room.on('warning', (err) => { log('room::warning', err) })
room.on('subscribed', (topic) => { log('room::subscribed', topic) })

room.on('peer joined', (id) => { log('room::peer joined:', short(id)) })
room.on('peer left', (id) => { log('room::peer left:', short(id)) })

room.on('message', (message) => {
  log('room::message from ' + short(message.from) + ': ' + message.data.toString())
})

setInterval(() => room.broadcast('ping'), 2000)

setInterval(showPeers, 5000)
function showPeers () {
  const peers = room.getPeers()
  log(`|peers|=${peers.length} [${peers.map(short).join(',')}]`)
}

//  This was my own hand rolled pubsub code
// await ipfs.pubsub.subscribe('scrobble', {}, (msg) => {
//   // {from: string, seqno: Buffer, data: Buffer, topicCIDs: Array<string>}
//   const from = msg.from()
//   log(`subscribe: from ${from}`)
// })
// log(`+subscribed (${id.id})`)

// setInterval(showSwarm, 5000)
// async function showSwarm () {
//   log('-swarm')
//   const peers = await ipfs.swarm.peers()
//   log(`|peers|=${peers.length}`)
//   for (let peer of peers) {
//     const id = peer.peer.id.toB58String()
//     const addr = peer.addr.toString()
//     log(` peer: ${addr} (${id})`)
//   }
//   log('+swarm')
// }
