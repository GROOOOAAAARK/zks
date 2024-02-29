# ZKS (Circuit Breaker 2024)

In order to use, must have rust and noir installed, as well as yarn and node to launch the web app to test the circuit and smart contracts.

## Installation

```bash
git clone

yarn install
```


## Build rust to wasm

```bash
docker build -t debian .
```

Then run the container:

```bash
docker run -v "$PWD/lib/circuit_utils":/home -it rust_packed_debian /bin/bash
```
