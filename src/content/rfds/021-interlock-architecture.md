---
title: "Interlock-Based Verification Architecture"
number: "021"
author: "FlexHEG"
state: "idea"
tags: ["verification", "hardware"]
created: "2024-11-27"
---

## The Idea

An "Interlock" is a Guarantee Processor positioned on the main data path—all data entering or leaving the accelerator must pass through it. This is fundamentally stronger than passive monitoring because the Interlock can: directly observe all I/O without trusting the accelerator to report honestly, encrypt outgoing data (controlling which other accelerators can read it), and block non-compliant operations.

The Interlock treats the accelerator as a black box, reducing dependence on understanding or trusting accelerator internals. This speeds adaptation to novel accelerator types and requires less information sharing from manufacturers.

## Why It Matters

Passive monitoring (reading performance counters, sampling memory) can always be spoofed by a compromised accelerator. An Interlock on the data path sees ground truth for all external communication. Combined with encryption, it can enforce cluster topology (only approved accelerators can decrypt the data), making guarantees about multi-accelerator workloads robust.

## Architecture

```
┌─────────────────────────────────────────────────┐
│              SECURE ENCLOSURE                   │
│                                                 │
│  ┌─────────────┐      ┌─────────────────────┐  │
│  │             │      │                     │  │
│  │ ACCELERATOR │◄────►│     INTERLOCK       │  │
│  │  (untrusted)│      │  (Guarantee Proc +  │  │
│  │             │      │   Crypto Engine +   │  │
│  └─────────────┘      │   Data Buffer)      │  │
│                       └──────────┬──────────┘  │
│                                  │              │
└──────────────────────────────────┼──────────────┘
                                   │
                            Encrypted Network
                                   │
                    ┌──────────────┴──────────────┐
                    │      OTHER INTERLOCKS       │
                    └─────────────────────────────┘
```

## Data Access

The Interlock can observe:
- All network traffic (direct, on data path)
- HBM contents via DMA (if positioned on PCIe)
- Power measurements (if integrated with power delivery)
- Performance counters (if accelerator reports them)

Trust hierarchy: Network traffic > DMA reads > Accelerator-reported counters

## Cryptography Requirements

For inline encryption at NVLink speeds (900GB/s):
- AES-GCM with hardware acceleration
- ~3% of H100 compute equivalent to encrypt all NVLink traffic
- ~11% for all HBM traffic (probably not practical)
- ~0.5% for all PCIe traffic

Key security: AES-GCM nonce must never be reused (allows key recovery). Precompute cipher, XOR with data stream for near-zero latency.

## Implementation Locations

| Location | Bandwidth | Retrofittable | Trust Level |
|----------|-----------|---------------|-------------|
| On accelerator die | HBM (3TB/s) | No | Highest |
| HBM chiplet | HBM (3TB/s) | No | High |
| NVLink interposer | NVLink (900GB/s) | Difficult | High |
| NIC | PCIe/Network (100GB/s) | Yes | Medium |

## Open Questions

- What's the latency overhead of inline encryption?
- Can the Interlock keep up with future bandwidth increases (1600Gb/s NICs)?
- How to handle network switches that need to operate on data (e.g., NVIDIA SHARP)?
- If DMA reads can be spoofed, how much does network-only observation reduce security?

## References

- [Amazon Nitro architecture](https://aws.amazon.com/blogs/machine-learning/a-secure-approach-to-generative-ai-with-aws/)
- [NVIDIA Confidential Computing](https://developer.nvidia.com/blog/confidential-computing-on-h100-gpus-for-secure-and-trustworthy-ai/)
- [AES-GCM nonce reuse vulnerability](https://frereit.de/aes_gcm/)
