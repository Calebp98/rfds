---
title: "Network Exhaustion Protocol"
number: "013"
author: "James Petrie"
state: "idea"
tags: ["verification", "network", "inference"]
created: "2024-11-26"
---

## The Idea

Minimize unexplained network traffic leaving a cluster so undeclared workloads (e.g., secret training on an inference cluster) become detectable. Combine with workload declaration, inline network tap, random/full logging, and random recomputation.

For inference: single network cable to cluster, all traffic passes through tap, declared workloads are randomly recomputed to verify logs match computation.

## Why It Matters

Network bandwidth is a scarce resource that's hard to hide. If all bandwidth is accounted for by declared workloads, undeclared workloads have nowhere to send their outputs. This is a chokepoint-based verification strategy.

## Open Questions

- How much bandwidth overhead does verification add?
- Can attackers compress or steganographically hide outputs?
- How to handle legitimate but variable network usage?

## References

- [Network exhaustion paper](https://arxiv.org/abs/2511.02620)
- [Inference Verification doc](https://docs.google.com/document/d/17LcWmrsvEl3tj97An1-ufHZ03go7qEpCxqRRegObESY/edit)
