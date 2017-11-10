var cluster = require('cluster')
const node = require('./lib/node')

const numWorkers = 2

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

if (cluster.isWorker) {
  (async () => {
    // await delay(Math.random() * 10 * 1000)
    console.log(`Worker ${process.pid} starting`)
    node.start(Math.random().toString().substring(2, 8))
  })()
}

if (cluster.isMaster) {
  (async () => {
    console.log(`Master ${process.pid} has started.`)

    // Fork workers.
    for (var i = 0; i < numWorkers; i++) {
      cluster.fork()
      await delay(10000)
    }

    // Be notified when worker processes die.
    cluster.on('death', function (worker) {
      console.log('Worker ' + worker.process.pid + ' died.')
    })
  })()
}
