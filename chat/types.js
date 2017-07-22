const IPFS = require('ipfs')
const ipfs = new IPFS({
  init: false,
  start: false
})

// const PeerId = require('peer-id')
// const PeerInfo = require('peer-info')
// const Node = require('./libp2p-bundle.js')
// const Node = require('../../libp2p-ipfs-nodejs')

module.exports = ipfs.types
