// ipfs node
const IPFS = require('ipfs')
const IPFSRepo = require('ipfs-repo')
// const wrtc = require('wrtc') // or require('electron-webrtc')()
// const wrtc = require('electron-webrtc')() // or require('wrtc')
// const WStar = require('libp2p-webrtc-star')
// const wstar = new WStar({ wrtc: wrtc })

const room = require('./room')

module.exports = {
  start: start
}

function start (processUniqueId) {
  const start = +new Date()
  let ipfsId = 'Qm00000000000'

  // TODO, just check for lock...
  const repoPath = `./data/ipfs-test-${processUniqueId}`
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
    // libp2p: { // add custom modules to the libp2p stack of your node
    //   modules: {
    //     transport: [wstar],
    //     discovery: [wstar.discovery]
    //   }
    // }
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

  setInterval(() => { log('monitor::still alive') }, 10000)
  const topic = 'im-scrbl'
  setTimeout(() => { room.start(ipfs, `${topic}`) }, 3000)

  // setTimeout(() => { startRoom(`${topic}-1`) }, 5000) // [5-25]
  // setTimeout(() => { startRoom(`${topic}-2`) }, 30000) // [30-40]
}

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
