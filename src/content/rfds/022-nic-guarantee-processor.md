---
title: "NIC Repurposing for Guarantee Processor"
number: "022"
author: "FlexHEG"
state: "idea"
tags: ["verification", "hardware", "network"]
created: "2024-11-27"
---

## The Idea

Modern Network Interface Controllers (like NVIDIA ConnectX-8) already have programmable compute, inline cryptography hardware, and DMA capability. They sit on the data path between accelerators and the network. Repurposing or replacing the NIC is the most promising path to retrofittable flexHEG that third parties can deploy without accelerator manufacturer cooperation.

Amazon's Nitro system already uses NICs as hardware-backed security boundaries for VM isolation. The same approach can provide workload guarantees for AI accelerators.

## Why It Matters

Integrated flexHEG requires multi-year hardware design cycles and manufacturer cooperation. NIC-based flexHEG could potentially be deployed by swapping a component, enabling verification capabilities years sooner. Amazon is already using custom NICs with NVL72 systems, demonstrating that NIC replacement is operationally feasible.

## NIC Capabilities (ConnectX-8)

- 800Gb/s throughput (100GB/s)
- Programmable compute for in-network processing
- Hardware inline cryptography
- DMA to read HBM contents
- Simpler architecture than CPU (smaller attack surface)

## Encrypted Cluster Formation Protocol

1. Declare network graph of allowed communication pairs (device IDs)
2. Each Guarantee Processor assembles list of destination IDs
3. Key lookup:
   - **Logging version**: Request permission from external governance system, receive approval certificate + public keys
   - **Decentralized version**: Check local lookup table for public keys
4. Generate AES-GCM session key, load into output crypto engine
5. Encrypt session key with each destination's public key, send
6. Decrypt incoming session keys, verify approval, load into input crypto engine
7. Encrypted communication begins

## Advantages

- **Retrofittable**: Can replace NIC without changing accelerator
- **On data path**: Direct observation of all scale-out network traffic
- **Existing crypto hardware**: No need to design new encryption engines
- **DMA capability**: Can read HBM for additional verification
- **Operational precedent**: Amazon Nitro, hyperscaler custom NICs

## Challenges

- **Hyperscaler integration**: Major cloud providers have existing cluster management protocols; replacing them is costly
- **NVLink blind spot**: NIC only sees scale-out network, not intra-node NVLink traffic
- **DMA trust**: PCIe reads route through multiple components that could be compromised
- **Vendor cooperation**: Still need NIC vendor (NVIDIA, Mellanox) cooperation for firmware changes

## Deployment Path

1. Analyze existing NIC security and auditability (ConnectX, Nitro)
2. Develop flexHEG firmware for existing NIC hardware
3. If insufficient: design Guarantee Processor IP block for integration into future NICs
4. Open-source IP block for multi-vendor adoption

## Open Questions

- Can ConnectX firmware be updated for flexHEG without hardware changes?
- What's the minimum viable NIC modification for useful guarantees?
- How to handle NVLink traffic that doesn't go through NIC?
- Can a flexHEG NIC be trusted if the NIC vendor is adversarial?

## References

- [Amazon Nitro](https://aws.amazon.com/blogs/machine-learning/a-secure-approach-to-generative-ai-with-aws/)
- [NVIDIA ConnectX-8 datasheet](https://resources.nvidia.com/en-us-accelerated-networking-resource-library/connectx-datasheet-c)
- [GB200 NVL72 component analysis (SemiAnalysis)](https://semianalysis.com/2024/07/17/gb200-hardware-architecture-and-component/)
- [GPUDirect RDMA documentation](https://docs.nvidia.com/cuda/gpudirect-rdma/)
