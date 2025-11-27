---
title: "NIC-Based Bandwidth Limiting & Interconnect Verification"
number: "029"
author: "Amodo"
state: "idea"
tags: ["verification", "hardware", "network"]
created: "2024-11-27"
---

## The Idea

Use NVIDIA SmartNICs (BlueField DPUs) to enforce bandwidth quotas, verify interconnect topology, and provide node-to-node encryption—all controllable by a central authority. This is a concrete implementation of the NIC-based Guarantee Processor concept (RFD 022).

System goals (scoped with Lisa Thiergart / SL5 Task Force):
- Quotas leased by central controller (bandwidth, transfer volume, lifetime)
- Encryption between accelerators inside different tamper-proof enclosures
- Key revocation on tamper event or lease expiration

## Implementation Status (Amodo)

**Phase 1: Software implementation (complete)**
- Controller + DPUs communicate over encrypted WireGuard UDP tunnel
- Controller leases traffic quotas to DPUs
- DPUs enforce quotas via Linux traffic controller (tc)
- DPUs report live data back to controller
- UI for visualization and quota management
- Running on Amodo research server

**Phase 2: Hardware acceleration (in progress)**
- Set up BlueField 2 and BlueField 3 DPUs
- Learning DOCA stack (poorly documented, many broken examples)
- Got hardware-accelerated encryption working
- Weekly calls with NVIDIA BlueField engineering team
- NVIDIA built matching test rig to support Amodo's work

**Key learnings:**
- DPU setup is hard: "only the most advanced GPU cloud operators implement tenant isolation using DPUs" (SemiAnalysis)
- DOCA documentation is poor; tutorial series has episode 1 but no episode 2
- Few users have implemented real DOCA apps outside NVIDIA's own engineers
- Different BlueField SKUs have different capabilities (NVIDIA helping identify right SKU)

## Outputs Planned

- DOCA documentation and primers for community
- Suitable SKUs, compilation environment, NVIDIA contacts
- Working demo for SL5 Task Force
- Documentation/libraries that labs could implement

## Open Questions

- Performance at scale (can software tc keep up? need full hardware path?)
- Integration with tamper detection (RFD 028) for key revocation
- Path to production deployment in real datacenters

## References

- Related: RFD 022 (NIC Repurposing for Guarantee Processor) — concept
- Related: RFD 021 (Interlock-Based Architecture) — design pattern
- [NVIDIA DOCA documentation](https://docs.nvidia.com/doca/sdk/)
- SemiAnalysis on DPU complexity
