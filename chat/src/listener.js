'use strict'

const PeerId = require('peer-id')
const PeerInfo = require('peer-info')
// const Node = require('./libp2p-bundle.js')
const Node = require('../../libp2p-ipfs-nodejs')
const pull = require('pull-stream')
const Pushable = require('pull-pushable')
const p = Pushable()

PeerId.createFromJSON(require('./peer-id-listener'), (err, idListener) => {
  if (err) {
    throw err
  }
  const peerListener = new PeerInfo(idListener)
  // peerListener.multiaddr.add('/ip4/0.0.0.0/tcp/10333')
  peerListener.multiaddrs.add('/ip4/0.0.0.0/tcp/10333')
  const nodeListener = new Node(peerListener)

  const shortName = idListener.toB58String().substr(0, 8)
  function log (direction) {
    return msg => {
      console.log(direction + shortName, msg)
    }
  }
  nodeListener.start((err) => {
    if (err) {
      throw err
    }

    nodeListener.swarm.on('peer-mux-established', (peerInfo) => {
      log('==')(`peer-mux-established: ${peerInfo.id.toB58String()}`)
    })

    nodeListener.handle('/chat/1.0.0', (protocol, conn) => {
      pull(
        p,
        conn
      )

      pull(
        conn,
        pull.map((data) => {
          return data.toString('utf8').replace('\n', '')
        }),
        // pull.drain(console.log)
        pull.drain(log('<<'))
      )

      // heartbeat
      const randInterval = Math.floor(Math.random() * 2000 + 1000)
      console.log('interval', randInterval)
      setInterval(() => {
        const stamp = new Date().toISOString()
        // console.log('>>', stamp)
        log('>>')(stamp)
        p.push(stamp)
      }, randInterval)

      process.stdin.setEncoding('utf8')
      process.openStdin().on('data', (chunk) => {
        var data = chunk.toString()
        // console.log('>>', data)
        log('>>')(data)
        p.push(data)
      })
    })

    console.log(`Listener ready (${shortName}), listening on:`)
    peerListener.multiaddrs.forEach((ma) => {
      console.log(ma.toString() + '/ipfs/' + idListener.toB58String())
    })
  })
})
