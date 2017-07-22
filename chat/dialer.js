'use strict'

const types = require('./types')
const PeerId = types.PeerId
const PeerInfo = types.PeerInfo

const Node = require('ipfs/src/core/runtime/libp2p-nodejs')

const pull = require('pull-stream')
const async = require('async')
const Pushable = require('pull-pushable')
const p = Pushable()

async.parallel([
  (callback) => {
    // PeerId from JSON
    // PeerId.createFromJSON(require('./peer-id-dialer'), (err, idDialer) => {
    PeerId.create({ bits: 2048 }, (err, idDialer) => {
      if (err) {
        throw err
      }
      // console.log('dialer ', JSON.stringify(idDialer.toJSON(), null, 2))
      console.log('dialer ', idDialer.toB58String())

      callback(null, idDialer)
    })
  },
  (callback) => {
    PeerId.createFromJSON(require('./peer-id-listener'), (err, idListener) => {
      if (err) {
        throw err
      }
      callback(null, idListener)
    })
  }
], (err, ids) => {
  // got 2 PeerIds: [dialer,listener]
  if (err) throw err

  const idDialer = ids[0]
  const idListener = ids[1]

  const shortName = idDialer.toB58String().substr(0, 8)
  function log (direction) {
    return msg => {
      console.log(direction + shortName, msg)
    }
  }
  log('==')(`I am ${idDialer.toB58String()}`)

  const peerDialer = new PeerInfo(idDialer)
  peerDialer.multiaddrs.add('/ip4/0.0.0.0/tcp/0')
  const nodeDialer = new Node(peerDialer)

  const peerListener = new PeerInfo(idListener)
  peerListener.multiaddrs.add('/ip4/127.0.0.1/tcp/10333')
  nodeDialer.start((err) => {
    if (err) {
      throw err
    }

    log('==')('Dialer ready, Listener listening on:')

    peerListener.multiaddrs.forEach((ma) => {
      log('==')(ma.toString() + '/ipfs/' + idListener.toB58String())
    })

    nodeDialer.swarm.dial(peerListener, '/chat/1.0.0', (err, conn) => {
      if (err) {
        throw err
      }
      console.log('nodeA dialed to nodeB on protocol: /chat/1.0.0')
      console.log('Type a message and see what happens')
      // Write operation. Data sent as a buffer
      // from pushable to connection
      pull(
        p,
        conn
      )
      // Sink, data converted from buffer to utf8 string
      // from connection to local echo
      pull(
        conn,
        pull.map((data) => {
          return data.toString('utf8').replace('\n', '')
        }),
        pull.drain(log('<<'), () => {
          console.log('*** DONE ***')
        })
      )

      // heartbeat
      const randInterval = Math.floor(Math.random() * 2000 + 5000)
      log('==')(`pinging at interval: ${randInterval}`)
      setInterval(() => {
        const stamp = new Date().toISOString()
        const msg = stamp + ' from:' + shortName
        log('>>')(msg)
        p.push(msg)
      }, randInterval)

      // echo stdin
      process.stdin.setEncoding('utf8')
      process.openStdin().on('data', (chunk) => {
        var data = chunk.toString()
        log('>>')(data)
        p.push(data)
      })
    })
  })
})
