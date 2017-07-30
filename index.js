
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

function short (idStr) {
  return idStr.substr(0, 6)
}
function log (...args) {
  const elapsed = Math.floor((+new Date() - start) / 1000)
  console.log(new Date().toISOString(), `+${elapsed}`, short(ipfsId), ...args)
}

ipfs.on('init', () => { log('ipfs::init') })

ipfs.once('ready', async () => {
  const id = await ipfs.id()
  ipfsId = id.id
  log('ipfs::ready')
})
ipfs.on('error', (err) => { log('ipfs::error', err) })
ipfs.on('start', async () => { log('ipfs::start') })
ipfs.on('stop', () => { log('ipfs::stop') })

async function startRoom (topic) {
  const room = Room(ipfs, topic)
  room.on('stop', (message) => { log(`stop::${topic}`) })
  room.on('error', (err) => { log(`error:::${topic}`, err) })
  room.on('warning', (err) => { log(`warning:::${topic}`, err) })
  room.on('subscribed', (topic) => { log('room::subscribed', topic) })

  room.on('peer joined', (id) => { log(`peer joined::${topic}`, short(id)) })
  room.on('peer left', (id) => { log(`peer left::${topic}`, short(id)) })

  room.on('message', (message) => {
    log(`message::${topic} from:${short(message.from)} : ${message.data.toString()}`)
  })

  const clearPing = setInterval(() => room.broadcast('ping'), 2000)

  const clearPeers = setInterval(showPeers, 5000)
  function showPeers () {
    const peers = room.getPeers()
    log(`|peers::${topic}|=${peers.length} [${peers.map(short).join(',')}]`)
  }

  const leaveAndClear = () => {
    log(`Leaving room ${topic}`)
    clearTimeout(clearPing)
    clearTimeout(clearPeers)
    room.leave()
  }

  // setTimeout(leaveAndClear, 20000)
}

const topic = 'im-scrbl'
setTimeout(() => { startRoom(`${topic}-1`) }, 5000) // [5-25]
// setTimeout(() => { startRoom(`${topic}-2`) }, 30000) // [30-40]

// -=-=-= shut things down
// This causes an exception, wether I start rooms or not...
// AssertionError [ERR_ASSERTION]: FloodSub is not started
//     at FloodSub.unsubscribe (/Users/daniellauzon/Code/iMetrical/im-discovery/node_modules/libp2p-floodsub/src/index.js:328:5)

// setTimeout(() => { ipfs.stop() }, 50000) // [0-50]

// -=-=-=-=-=-=-=
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
