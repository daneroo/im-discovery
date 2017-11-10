var cluster = require('cluster')
const node = require('./lib/node')

// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const argv = require('yargs')
  .usage('Usage: $0 [--id [unique-on-host]]')
  .default('id', Math.random().toString().substring(2, 8))
  .argv

const processUniqueId = argv.id

node.start(processUniqueId)

