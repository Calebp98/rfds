---
title: "Guarantee Processor Design"
number: "019"
author: "FlexHEG"
state: "idea"
tags: ["verification", "hardware"]
created: "2024-11-27"
---

## The Idea

A Guarantee Processor is a dedicated, auditable compute component that monitors accelerator usage and verifies compliance with specified rules. Unlike general-purpose CPUs or GPUs (which prioritize performance over auditability), the Guarantee Processor is designed to be simple enough for third-party audit, secure against physical and cyber attacks, and flexible enough to execute updatable guarantee logic.

The processor needs: general-purpose compute capability, access to accelerator workload data (memory, instructions, network traffic, performance counters, power), accurate timekeeping, cryptographic hardware (ideally quantum-resistant), secure boot with rollback protection, and the ability to sign attestation certificates. It should be performant enough to verify a fraction of accelerator computation—roughly 1/192 the power of a Blackwell chip (one Streaming Multiprocessor equivalent).

## Why It Matters

Guarantees about AI workloads are only credible if the component checking them can be trusted. General-purpose hardware has too many conflicting priorities; a dedicated Guarantee Processor can be open-sourced, formally verified, and physically audited without revealing trade secrets. This is the foundation for any hardware-enabled governance regime.

## Implementation Options

| Location | Pros | Cons |
|----------|------|------|
| **On-chip (accelerator die)** | Hardest to tamper, direct access to signals | Requires manufacturer cooperation, multi-year lead time |
| **HBM-PIM/PNM** | Direct memory access, transferable across accelerator types | Doesn't exist yet, requires HBM vendor cooperation |
| **NIC** | Retrofittable, sits on network data path, DMA to HBM | PCIe reads could be spoofed, requires NIC vendor cooperation |
| **DC-SCM/BMC** | Easiest to replace, already has power monitoring | Not on data path, easier to spoof readings |
| **Dedicated chiplet** | Can be added to existing boards via PCIe | Supply chain complexity, physical access concerns |

## Design Requirements

- FPGA or general-purpose processor for flexible guarantee logic
- Hardware AES-GCM (ideally 800Gb/s+ for NIC-based designs)
- Secure random number generator
- Glitch/fault injection protection
- Non-volatile memory for months of local logs
- Lockstep execution capability (run same instructions on 2-3 processors, compare outputs)

## Trust Mechanisms

1. **Open-source design**: HDL can be audited and compared against physical scans of random chips
2. **FPGA-based logic**: Configurations publicly auditable, harder to hide trojans in uniform structure
3. **Multi-vendor lockstep**: Source processors from different manufacturers, use 2/3 voting
4. **FIPS-140-3 style certification**: Formal security evaluation process

## Open Questions

- Can existing RISC-V cores on NVIDIA GPUs (used for GPU System Processor) be repurposed?
- What's the minimum viable processor for useful guarantees?
- How to handle guarantee logic updates without introducing vulnerabilities?

## References

- [OpenTitan](https://opentitan.org/) — open-source silicon root of trust
- [Caliptra](https://github.com/chipsalliance/caliptra) — datacenter SoC root of trust
- [NVIDIA GPU System Processor](https://www.adacore.com/papers/nvidia-adoption-of-spark-new-era-in-security-critical-software-development)
- [zeroRISC post-quantum secure boot](https://www.zerorisc.com/blog/post-quantum-secure-boot-on-opentitan)
