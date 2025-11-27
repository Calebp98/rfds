---
title: "Training vs Inference Workload Discrimination"
number: "027"
author: "Amodo"
state: "idea"
tags: ["verification", "side-channel", "inference"]
created: "2024-11-27"
---

## The Idea

Use out-of-band signals (power draw, EM emissions, network traffic patterns) to distinguish training workloads from inference workloads, without trusting software attestation. This enables verification regimes where clusters are licensed for inference-only but might attempt unauthorized training.

Key observables:
- **Power**: Training has sustained high power; inference is bursty
- **Network**: Training has AllReduce patterns across many nodes; inference is request-response
- **Memory**: Training updates weights; inference doesn't (detectable via cache/memory access patterns?)
- **Duration**: Training runs for hours/days; inference requests complete in seconds

## Why It Matters

RFD 017 (Inference-Only Verification Package) assumes you can verify inference-only compliance. This RFD addresses *how* to make that determination from observable signals, which is the core technical challenge.

## Implementation Status (Amodo)

- Collecting side-channel data from research servers
- Testing power measurement, EM probes, network packet sniffing
- Building demo for policy stakeholders ("workload attestation")
- Planning to publish dataset for verification researchers

## Open Questions

- What's the minimum observation time to distinguish with high confidence?
- Can adversaries design "inference-shaped" training (small batches, bursty)?
- How does MoE routing affect signatures (sparse expert activation)?
- Can fine-tuning be distinguished from inference + from full training?

## References

- Related: RFD 017 (Inference-Only Verification Package)
- Related: RFD 001 (Side-Channel Leakage from LLM Inference)
- Related: RFD 012 (Analog Sensors for Compute Verification)
