# exploration of ipfs libp2p discovery

Note: how do I re-use this [bundle](https://github.com/ipfs/js-ipfs/blob/master/src/core/runtime/libp2p-nodejs.js)

## libp2p examples (js-libp2p-ipfs-nodejs)
echo example
```
node echo/src/listener.js
node echo/src/dialer.js
```
chat example
```
node chat/src/listener.js
node chat/src/dialer.js
```

## Discovery low level
```
node discovery/bootstrap.js
node discovery/mdns.js
```

## TODO
- structure with [aegir](https://github.com/ipfs/aegir)

## References
- [Implementations](https://libp2p.io/implementations/)
- [js-libp2p](https://github.com/libp2p/js-libp2p)
- [js-libp2p examples](https://github.com/libp2p/js-libp2p/tree/master/examples)
- [mdns](https://github.com/libp2p/js-libp2p-mdns)
- [bootstrap/railing](https://github.com/libp2p/js-libp2p-railing)
- [webrtc-star](https://github.com/libp2p/js-libp2p-webrtc-star)