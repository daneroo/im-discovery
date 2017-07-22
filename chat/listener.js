'use strict'

const types = require('./types')
const PeerId = types.PeerId
const PeerInfo = types.PeerInfo

const Node = require('ipfs/src/core/runtime/libp2p-nodejs')

const pull = require('pull-stream')
const Pushable = require('pull-pushable')
const p = Pushable()

PeerId.createFromJSON(require('./peer-id-listener'), (err, idListener) => {
  if (err) {
    throw err
  }
  const peerListener = new PeerInfo(idListener)
  peerListener.multiaddrs.add('/ip4/0.0.0.0/tcp/10333')
  const nodeListener = new Node(peerListener)

  const shortName = idListener.toB58String().substr(0, 8)
  function log (direction) {
    return msg => {
      console.log(direction + shortName, msg)
    }
  }
  log('==')(`I am ${idListener.toB58String()}`)

  nodeListener.start((err) => {
    if (err) {
      throw err
    }

    nodeListener.swarm.on('peer-mux-established', (peerInfo) => {
      log('==')(`peer-mux-established: peerInfo.id: ${peerInfo.id.toB58String()}`)
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
        pull.drain(log('<<'))
      )

      // heartbeat
      const randInterval = Math.floor(Math.random() * 2000 + 1000)
      log('==')(`pinging at interval: ${randInterval}`)
      setInterval(() => {
        const stamp = new Date().toISOString()
        const msg = stamp + ' from:' + shortName
        log('>>')(msg)
        p.push(msg)
      }, randInterval)

      process.stdin.setEncoding('utf8')
      process.openStdin().on('data', (chunk) => {
        var data = chunk.toString()
        log('>>')(data)
        p.push(data)
      })
    })

    log('==')('Listener ready, listening on:')
    peerListener.multiaddrs.forEach((ma) => {
      log('==')(ma.toString() + '/ipfs/' + idListener.toB58String())
    })
  })
})
