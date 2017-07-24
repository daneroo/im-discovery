
const IPFS = require('ipfs')

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const ipfs = new IPFS({
  // repo: repo,
  // init: true, // default
  // init: false,
  // init: {
  //   bits: 1024 // size of the RSA key generated
  // },
  // start: true,
  // start: false,
  EXPERIMENTAL: { // enable experimental features
    pubsub: true,
    sharding: true // enable dir sharding
    // dht: true // enable KadDHT, currently not interopable with go-ipfs
  }
  // config: { // overload the default IPFS node config
  //   Addresses: {
  //     Swarm: [
  //       '/ip4/127.0.0.1/tcp/1337'
  //     ]
  //   }
  // },
  // libp2p: { // add custom modules to the libp2p stack of your node
  //   modules: {}
  // }
})

ipfs.on('ready', async () => {
  console.log(`-ready`)
  const id = await ipfs.id()
  console.log(`+ready (${id.id})`)
})    // Node is ready to use when you first create it

ipfs.on('error', (err) => {
  console.log('error', err)
}) // Node has hit some error while initing/starting

ipfs.on('init', () => {
  console.log('init')
})     // Node has successfully finished initing the repo

ipfs.on('start', async () => {
  console.log('-start')
  const id = await ipfs.id()
  console.log(`+start (${id.id})`)

  await ipfs.pubsub.subscribe('scrobble', {}, (msg) => {
    // {from: string, seqno: Buffer, data: Buffer, topicCIDs: Array<string>}
    const from = msg.from()
    console.log(`subscribe: from ${from}`)
  })
  console.log(`+subscribed (${id.id})`)

  setInterval(async () => {
    await showSwarm(id)
  }, 5000)
})    // Node has started

ipfs.on('stop', () => {
  console.log('stop')
})     // Node has stopped

async function showSwarm (myId) {
  console.log('-swarm')
  const peers = await ipfs.swarm.peers()
  console.log(`|peers|=${peers.length}`)
  for (let peer of peers) {
    const id = peer.peer.id.toB58String()
    const addr = peer.addr.toString()
    console.log(` peer: ${addr} (${id})`)
  }
  console.log(`+swarm (${myId.id})`)
}
