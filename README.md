# ZKS (Circuit Breaker 2024)

In order to use, must have rust and noir installed, as well as yarn and node to launch the web app to test the circuit and smart contracts.

## Installation

### Requirements

- [ ] Deno (ideally)
- [ ] Node (for the web app)
- [ ] Pre-commit

### Workflow

```bash
git clone <repo_url>

deno install
```

## Usage

Set env vars for the web app:

```bash
export NEXT_PUBLIC_DEBUG=1 # Allows debug only accessible features like no network forcing
```

Then run the web app:

```bash
deno run dev
```

## Proof Generation

Zero knowledge proof generation is done in the `useProofGeneration` hook.

You will need to have a wallet connected to the web app to generate a proof, choose an address and a solvency level to prove.

Form submission will trigger the proof generation, and you will be able to download the proof as a `binary` file.

## Offline Proof Verification

Zero knowledge proof verification is done in the `useProofVerification` hook.

You will need to select a binary file containing the proof as well as the solvency level you'd like to verify.

Form submission will trigger the proof verification, and you will be able to see the result of the verification.

## Onchain Proof Verification

**COMING SOON**
