var cluster = require('cluster')
const node = require('./lib/node')

// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const argv = require('yargs')
  .usage('Usage: $0 [--id [unique-on-host]]')
  .default('id', Math.random().toString().substring(2, 8))
  .argv

const processUniqueId = argv.id

if (cluster.isWorker) {
  console.log('Worker ' + process.pid + ' has started.')
  node.start(processUniqueId)

  // Send message to master process.
  process.send({msgFromWorker: `This is from worker ${process.pid}`})

  // Receive messages from the master process.
  process.on('message', function (msg) {
    console.log('Worker ' + process.pid + ' received message from master.', msg)
    if (msg.seqno) {
      process.send({msgFromWorker: `Acknowledged sequence from worker ${process.pid}`, seqno: msg.seqno})
    }
  })
}

if (cluster.isMaster) {
  console.log('Master ' + process.pid + ' has started.')

  // Fork workers.
  const numWorkers = 1
  for (var i = 0; i < numWorkers; i++) {
    var worker = cluster.fork()

    var sentSequenceNumber = 0
    var receivedSequenceNumber = 0
    // Receive messages from this worker and handle them in the master process.
    worker.on('message', function (msg) {
      console.log('Master ' + process.pid + ' received message from worker ' + this.process.pid + '.', msg)
      if (msg.seqno) {
        receivedSequenceNumber = msg.seqno
      }
    })
    // Receive errors from this worker process (as when worker.send() encounters an error)
    worker.on('error', function (msg) {
      console.log('Master ' + process.pid + ' received error from worker ' + this.process.pid + '.', msg)
    })

    // Send a message from the master process to the worker.
    setInterval(() => {
      console.log(`Master will send message to worker ${worker.process.pid} isDead:${worker.isDead()} sent:${sentSequenceNumber} recvd:${receivedSequenceNumber}`)
      if (sentSequenceNumber > receivedSequenceNumber) {
        console.log(`Master should exit or respawn after killing worker ${worker.process.pid}`)
        process.exit(1)
      }
      worker.send({
        seqno: ++sentSequenceNumber,
        msgFromMaster: 'This is from master ' + process.pid + ' to worker ' + worker.process.pid + '.'
      })
    }, 10000)
  }

  // Be notified when worker processes die.
  cluster.on('death', function (worker) {
    console.log('Worker ' + worker.process.pid + ' died.')
  })
}
