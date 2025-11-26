---
title: "Memory Exhaustion Protocol"
number: "014"
author: "James Petrie"
state: "discussing"
tags: ["verification", "protocol", "memory", "spot-checks"]
created: "2024-11-26"
---

## The Idea

Fill GPU memory with verifiable content so undeclared workloads have nowhere to store weights or activations. Use random memory spot checks, workload declaration, and random recomputation. Memory contents could be SHA-256 hashes based on device/memory index, with iteration counts tuned to be too slow to recompute on-demand.

This forces attackers to either declare their memory usage (and have it verified) or operate with severely constrained memory.

## Why It Matters

Memory, like network bandwidth, is a finite resource. If memory is verifiably full of declared content, undeclared models can't be loaded. Combined with network exhaustion, this closes two major resource loopholes.

## Open Questions

- What's the performance overhead of memory exhaustion?
- How to handle legitimate dynamic memory allocation?
- Can attackers use CPU memory or NVMe as overflow?

## References

- [Memory exhaustion concept doc](https://www.notion.so/Compute-transparency-via-verifiable-memory-exhaustion-27f60f987af080219c08f36894cf4e31)
- [SLALOM: Verifiable NN execution](https://arxiv.org/abs/1806.03287)
