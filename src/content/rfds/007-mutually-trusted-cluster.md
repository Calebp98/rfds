---
title: "Mutually Trusted Cluster for Log Verification"
number: "007"
author: "James Petrie"
state: "discussing"
tags: ["verification", "hardware", "confidentiality", "integrity"]
created: "2024-11-26"
---

## The Idea

Build a compute cluster that both prover and verifier trust—prover trusts confidentiality (won't leak weights/data), verifier trusts integrity (can't be tampered with). Use this cluster to re-run inference workloads and verify logs without compromising prover secrets.

Assembly protocol: (1) Verifier sets up the cluster hardware, (2) Prover places cluster in a SCIF, (3) Prover enters encrypted logs and model weights, (4) Cluster produces signed verification results. The cluster needs enough compute to re-run frontier model inference (e.g., prefill 1TB model for 5000 tokens).

## Why It Matters

Log verification is useless if the verifier can't trust the logs weren't fabricated, or if the prover won't share logs for fear of leaking proprietary information. A mutually trusted cluster threads this needle by making verification possible without either party fully trusting the other.

## Open Questions

- What's the minimum compute needed for practical recomputation?
- How to bootstrap trust in the cluster components themselves?
- Can this work for training verification, or only inference?

## References

- [Near-term Verification Workshop notes](https://docs.google.com/document/d/1GZJG8CVVFFYFZnojKvXSXRVPlr-wpkwOYOOBxrBFu6c/edit)
