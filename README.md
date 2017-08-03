# Exploration of ipfs and libp2p discovery

- Travis:
  - master: [![Build Status](https://travis-ci.org/daneroo/scrobbleCast.svg?branch=master)](https://travis-ci.org/daneroo/scrobbleCast)

## TODO
- refactor into single long running process (with n children), and monitor the chilren
  - https://github.com/foreverjs/forever-monitor
- bring room up and down
- clean shutdown of ipfs
- make work under docker (node-wrtc is failing)
  - see this for working travis build https://travis-ci.org/js-platform/node-webrtc
- see node version of: https://github.com/ipfs-shipyard/ipfs-pubsub-room
- see web demo: https://github.com/ipfs-shipyard/ipfs-pubsub-room-demo
- structure with [aegir](https://github.com/ipfs/aegir)

## run from node on OSX
- seems to hang after about 260s
- will not start witn ipfs v0.25* (ppined to ^0.24.1)
- creates a repo on startup in `ipfs-test-xxrandomxx`
```
# - potentially on same machine, with more than one node
node index.js --id one
node index.js --id 2
while true; do node index.js --id first; sleep 1; done
```

## Test
Simply stole the tests from `ipfs-pubsub-room`.
```
npm test
```

## Docker
`ipfs-pubsub-room` does not work with docker.
```
docker build -t disco .
docker run --rm -it --name disco1 disco
docker run --rm -it --name disco2 disco
```

Try pubsub through jsipfs
```
docker run --rm -it --name disco2 bash
alias jsipfs=./node_modules/.bin/jsipfs
jsipfs init
sleep 2
jsipfs config enablePubsubExperiment true
jsipfs config enable-pubsub-experiment true
sleep 2
jsipfs daemon &
#DEBUG=*,-mplex:* jsipfs daemon &
sleep 3
echo "I <3 IPFS -$(whoami)@$(hostname) $(date -Iseconds)" >content
hash=$(jsipfs add content|cut -d\  -f 2)
echo curl "https://ipfs.io/ipfs/$hash"
curl "https://ipfs.io/ipfs/$hash"
```

## References
- [Implementations](https://libp2p.io/implementations/)
- [js-libp2p](https://github.com/libp2p/js-libp2p)
- [js-libp2p examples](https://github.com/libp2p/js-libp2p/tree/master/examples)
- [mdns](https://github.com/libp2p/js-libp2p-mdns)
- [bootstrap/railing](https://github.com/libp2p/js-libp2p-railing)
- [webrtc-star](https://github.com/libp2p/js-libp2p-webrtc-star)