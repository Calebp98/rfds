---
title: "Chip Registry for AI Governance"
number: "031"
author: "Oxford Martin AI Governance Initiative"
state: "idea"
tags: ["verification", "hardware"]
created: "2024-11-27"
---

## The Idea

A registry containing unique identifiers for AI-specialized chips, along with metadata such as current ownership and potentially location information. The registry enables tracking of which countries and corporations control which chips, supporting supply chain verification and governance enforcement.

The registry requires robust unique identifiers for each chip. Candidates include: hardware-level private keys (such as those in NVIDIA H100s), physically unclonable functions (PUFs), or lower-tech solutions like adhesive glitter patterns with photographic verification. For real-time digital updates, a private key is required to prevent spoofing. For rare physical inspection-based updates, lower-tech solutions may suffice.

## Why It Matters

Chip identifiers are fundamental to hardware governance—without them, chips are fungible and untraceable. A registry enables: tracking of AI-specialized compute across borders, export control enforcement, and provides the foundation for international agreements requiring visibility into compute distribution.

## Technical Requirements

| Component         | Purpose                                      |
| ----------------- | -------------------------------------------- |
| Unique identifier | On-chip private key, PUF, or physical marker |
| Registry database | Stores chip ID → owner → location mappings   |
| Update protocol   | Secure ownership transfer, location updates  |
| Query interface   | Authorized parties can verify chip status    |
| Audit trail       | Immutable history of ownership changes       |

## Implementation Approaches

**Hardware-based (high security, requires manufacturer cooperation):**

- Use existing on-chip security modules (NVIDIA GPUs have private keys)
- PUF-derived identifiers tied to physical chip properties
- Remote attestation to prove chip identity without revealing key

**Physical inspection-based (lower security, deployable now):**

- Unique physical markers (glitter patterns, laser engravings)
- Photographic verification against registry database
- Tamper-evident seals with unique identifiers

## Open Questions

- How robust are current on-chip keys (NVIDIA GPUs, security modules, PUFs) against sophisticated state actors with physical access?
- Should location information be included given transparency-security tradeoffs for military hardware?
- Can "logical location" (institutional responsibility) substitute for physical location tracking?
- What governance structure should manage the registry? (International body, consortium, distributed?)
- How to handle chip destruction, recycling, or repurposing?
- What happens when chips are sold or transferred between organizations?

## References

- Shavit 2023 ("chip owner directory" concept)
- Cheng 2024 on AI chip registration policy
- Aarne, Fist, and Withers 2024 on secure governable chips
