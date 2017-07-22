
// not working yet
// no deps
const PeerInfo = require('peer-info')
const Node = require('./libp2p-ipfs-nodejs')
PeerInfo.create((err, pi) => {
  if (err) {
    throw err // handle the err
  }

  // this throws!!!
  pi.multiaddr.add('/ip4/0.0.0.0/tcp/0')

  const node = new Node(pi)
  node.start((err) => {
    if (err) {
      throw err // handle the err
    }
    console.log('Node is ready o/')
  })
})
