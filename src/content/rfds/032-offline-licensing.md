---
title: "Offline Licensing for Compute Rationing"
number: "032"
author: "RAND Corporation"
state: "idea"
tags: ["verification", "hardware", "cryptography"]
created: "2024-11-27"
---

## The Idea

Chips ship in a throttled state by default. A cryptographically signed license temporarily authorizes full performance by setting a "compute budget" on on-chip meters. When the budget is exhausted (e.g., 10¹⁸ FLOPs performed), the chip automatically throttles back to a baseline capability (e.g., 1% performance) until a new license is loaded.

The license is verified entirely on-chip against a fused public key—no internet connection required (hence "offline"). Licenses are device-specific (tied to serial number), preventing transfer between chips. This creates a renewable, auditable chokepoint for compute governance without requiring always-on connectivity.

## Why It Matters

Current export controls are binary: chips are either sold or not sold. Offline licensing enables a middle path where chips can be exported but their *cumulative usage* is governed. This could:
- Allow continued sales to third-party countries with usage caps
- Make smuggled chips less valuable (they need ongoing licenses)
- Provide a technical foundation for international compute agreements
- Enable subscription-based compute models with governance hooks

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        GPU                              │
│                                                         │
│  ┌─────────────────┐      ┌─────────────────────────┐  │
│  │  COMPUTE UNITS  │◄────►│      METER BLOCK        │  │
│  │  (SMs, Tensor   │      │                         │  │
│  │   Cores, etc.)  │      │  • FLOP counter         │  │
│  └─────────────────┘      │  • Memory transfer ctr  │  │
│                           │  • Interconnect ctr     │  │
│                           │  • License remaining    │  │
│                           └───────────┬─────────────┘  │
│                                       │                 │
│  ┌─────────────────┐      ┌───────────▼─────────────┐  │
│  │  LICENSE VERIF  │◄────►│    THROTTLE CONTROL     │  │
│  │                 │      │                         │  │
│  │  • Public key   │      │  • If meters exhausted: │  │
│  │    (fused)      │      │    reduce clock/disable │  │
│  │  • Sig verify   │      │    functional units     │  │
│  │  • Replay check │      │                         │  │
│  └────────┬────────┘      └─────────────────────────┘  │
│           │                                             │
└───────────┼─────────────────────────────────────────────┘
            │
      License input
      (via driver, USB,
       manual entry, etc.)
```

## License Lifecycle

| Phase | Actor | Action |
|-------|-------|--------|
| **Allocation** | Governance body | Assigns aggregate compute caps per country/entity |
| **Signing** | License authority | Creates signed license specifying device serial number + meter budgets |
| **Transmission** | Operator | Delivers license to device (any channel—internet, USB, manual) |
| **Verification** | On-chip | Checks signature against fused public key, validates device ID |
| **Application** | On-chip | Sets/adds to meter values, enables full performance |
| **Consumption** | On-chip | Meters count down as resources are used |
| **Expiration** | On-chip | When meters reach zero, throttle engages automatically |

## Meter Options

| Resource | Workload Target | Notes |
|----------|-----------------|-------|
| Floating-point ops | Matrix multiplication, training | Core metric for AI governance |
| Integer ops | Quantized inference, integer training | Prevents data-type arbitrage |
| Memory transfer (bytes) | Weight loading, activations | Bottleneck for large models |
| Interconnect transfer | Distributed training | Limits multi-chip scaling |
| Energy (watt-hours) | Overall utilization | Hardware-agnostic metric |
| Clock cycles | General computation | Simplest to implement |

Multiple meters can be active simultaneously; license specifies budget for each.

## Throttle Actions

When a meter is exhausted:

| Action | Effect | Reversibility |
|--------|--------|---------------|
| Clock reduction | Slow all operations to 1% speed | Immediate on new license |
| Functional unit disable | Turn off tensor cores, leave CUDA cores | Immediate on new license |
| Memory bandwidth limit | Throttle HBM interface | Immediate on new license |
| Complete disable | Chip becomes non-functional | Requires new license |

The RAND paper suggests allowing baseline functionality (e.g., consumer gaming) without a license, while requiring licenses only for high-performance AI workloads.

## Security Requirements

| Component | Threat | Mitigation |
|-----------|--------|------------|
| Public key | Replacement | Fused into silicon at manufacture |
| Meter registers | Reset via fault injection | Distributed/redundant counters, sanity checks |
| Signature verification | Side-channel key extraction | Time/power-invariant crypto implementation |
| License replay | Reuse same license multiple times | Sequence numbers or hash log of prior licenses |
| Throttle mechanism | Bypass via wire cutting | Integrate with core compute path |

## Open Questions

- Who is the license authority? (Chip vendor? US government? International body?)
- What governance process determines allocation of compute budgets?
- How to prevent license stockpiling before a policy change?
- What's the right granularity for license duration? (Days? Months? Per-job?)
- How to handle legitimate workloads that exceed licensed compute mid-job?
- Can licenses be made non-fungible to prevent gray markets?
- How to set the throttled baseline without making chips useless for legitimate non-AI uses?

## References

- RAND WR-A3056-1, Chapter 6: Offline Licensing Approach
- Intel On Demand (commercial precedent for feature licensing)
- Executive Order 14110 (10²⁶ FLOP threshold for reporting)
