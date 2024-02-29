# ZKS (Circuit Breaker 2024)

## Description

Zero Knowledge Solvency (ZKS) is a project created for the Circuit Breaker Hackathon 2024. It is a tool to verify the solvency of an address or list of addresses, using Noir as a backend to generate the proofs and a smart contract to verify them.

## Upgrades imagined

- [ ] Deploy circuit as a Aztec Contract
- [ ] Handle multiple accounts
- [ ] Handle multiple tokens
  - [ ] Store contracts addresses
  - [ ] Use oracles to get token statuses
- [ ] Handle multiple networks at once
  - [ ] Use / develop bridges to allow seemless integration
- [ ] Use compiled wasm for better / easier feature integration

## Env dev

- [ ] Configure better Vagrant box to build noir / rust to wasm
- [ ] Use Ansible to configure the box with all needed artifacts
