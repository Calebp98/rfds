---
title: "Network Tap for Compute Verification"
number: "005"
author: "James Petrie"
state: "idea"
tags: ["verification", "hardware", "network", "logging"]
created: "2024-11-26"
---

## The Idea

All data transfer in/out of an AI cluster passes through a trusted network interlock that can log, hash, or sample traffic. The tap must relay data with low latency and high enough bandwidth for inference workloads, while being trusted by verifiers to accurately record traffic and trusted by provers not to enable sabotage or weight theft.

Key design questions: Can a COTS FPGA work for this? How much processing power is needed to hash the full data stream vs. random sampling? Where is un-hashed data stored for later comparison? Does this need a separate untrusted switch for fan-out (e.g., 1-to-72)?

## Why It Matters

Network-level verification is one of the few chokepoints where all cluster I/O can be observed without trusting individual GPUs or software stacks. A trusted tap enables workload declaration verification, inference recomputation audits, and detection of undeclared training on inference clusters.

## Open Questions

- Hash full stream or random sample? What's the tradeoff?
- Can this scale to high-bandwidth training workloads (see flexHEG report p.41)?
- How to establish trust in the tap itself for international verification?

## References

- [Private Island: Open Source FPGA Network Processor](https://privateisland.tech/dev/private-island)
- [Antmicro FPGA platform](https://antmicro.com/blog/2020/04/zynq-video-board/)
- [flexHEG report](https://arxiv.org/pdf/2506.03409) (Project 2, p.41)
