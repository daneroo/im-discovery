# Exploration of ipfs and libp2p discovery

## TODO
- two nodes with pubsub
- structure with [aegir](https://github.com/ipfs/aegir)

## Docker
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