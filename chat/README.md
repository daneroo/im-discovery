# Chat example with libp2p (ipfs)

- add package.json for local demo
- as symmetric as posible
- eliminate exception (`Error: underlying socket has been closed`)
- setup dependancies using only js-ipfs (`require('ipfs')`)
- setup dependancies using only js-libp2p (`require('libp2p')`)
- Can I avoid using constructor to get access to types?
```
const ipfs = new IPFS({
  init: false,
  start: false
})
const types = ipfs.types
```
- how do I re-use this [bundle](https://github.com/ipfs/js-ipfs/blob/master/src/core/runtime/libp2p-nodejs.js)
  - it is present in `./node_modules/ipfs/node_modules/libp2p-ipfs-nodejs/src/index.js`

## libp2p examples (js-libp2p-ipfs-nodejs)
chat example
```
cd chat
npm i
npm start
# - or -
node listener.js
node dialer.js
```
