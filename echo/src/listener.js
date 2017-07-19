'use strict'

/*
 * Listener Node
 */

const PeerId = require('peer-id')
const PeerInfo = require('peer-info')
// const Node = require('./libp2p-bundle')
const Node = require('../../libp2p-ipfs-nodejs')
const pull = require('pull-stream')
const series = require('async/series')

let listenerId
let listenerNode

function stamp () {
  return new Date().toISOString()
}
series([
  (cb) => {
    PeerId.createFromJSON(require('./id-l'), (err, id) => {
      if (err) { return cb(err) }
      listenerId = id
      cb()
    })
  },
  (cb) => {
    const listenerPeerInfo = new PeerInfo(listenerId)
    // console.log('listenerPeerInfo',listenerPeerInfo)
    listenerPeerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/10333')
    listenerNode = new Node(listenerPeerInfo)

    listenerNode.swarm.on('peer-mux-established', (peerInfo) => {
      console.log(stamp(), 'received dial to me from:', peerInfo.id.toB58String())
    })

    listenerNode.handle('/echo/1.0.0', (protocol, conn) => {
      console.log(stamp(), 'handling protocol', protocol)
      return pull(conn, conn)
    })
    listenerNode.start(cb)
  }
], (err) => {
  if (err) { throw err }

  console.log(stamp(), 'Listener ready, listening on:')
  listenerNode.peerInfo.multiaddrs.forEach((ma) => {
    console.log('  ', ma.toString() + '/ipfs/' + listenerId.toB58String())
  })
})
