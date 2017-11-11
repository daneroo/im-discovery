# Discovery with datproject

Investigating the discovery mechanism under [datproject](https://datproject.org/), 
([dat-node](https://github.com/datproject/dat-node))
which is using [discovery-swarm](https://github.com/mafintosh/discovery-swarm)

- Works from local network, e.g. dirac(x2),shannon
- Work with remote, but connection order seems fragile
- docker need some PORT magic...


## Docker
```
docker build -t disco .
docker run --rm -it --name disco1 disco
docker run --rm -it --name disco2 disco

```