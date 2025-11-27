---
title: "Performance Counter Integrity Protection"
number: "035"
author: "RAND Corporation"
state: "idea"
tags: ["verification", "hardware", "side-channel"]
created: "2024-11-27"
---

## The Idea

Protect on-chip performance counters (used for compute metering) against tampering, reset, and manipulation. GPUs already contain extensive performance monitoring infrastructure for debugging and profiling; these counters become security-critical when used for governance.

Attacks include: fault injection to reset counters, cutting signal wires to prevent incrementing, manipulating aggregation logic, and exploiting the counter read path. Defense requires distributed redundancy, sanity checking, shielding, and tamper detection.

## Why It Matters

Offline licensing (RFD 032) and FLOP counting (RFD 024) depend on accurate, tamper-resistant metering. If an attacker can reset or freeze performance counters, they can use unlimited compute while appearing to consume none. Counter integrity is the foundation of hardware-based compute governance.

## Existing Counter Infrastructure

NVIDIA GPUs already track:

| Counter Type | Granularity | Examples |
|--------------|-------------|----------|
| Instruction counters | Per-SM | Instructions issued, instructions retired |
| FLOP counters | Per-SM | FP16/FP32/FP64 operations, tensor core ops |
| Memory counters | Per-memory controller | Bytes read/written, cache hits/misses |
| Interconnect counters | Per-link | NVLink bytes transferred, PCIe transactions |
| Power/thermal | Chip-wide | Instantaneous power, temperature |

These are currently used for profiling (NSight, DCGM) but are not designed to be tamper-resistant.

## Attack Vectors

| Attack | Mechanism | Difficulty |
|--------|-----------|------------|
| **Fault injection (EM pulse)** | Randomize counter values | Medium (requires proximity) |
| **Fault injection (voltage glitch)** | Reset counters to zero | Medium |
| **Laser fault injection** | Target specific counter bits | High (requires decapping) |
| **Wire cutting (FIB)** | Sever increment signal path | High (requires FIB equipment) |
| **Firmware manipulation** | Report false values via driver | Low (if firmware unsigned) |
| **Aggregation attack** | Manipulate when counters are summed | Medium |

## Defense: Distributed Redundancy

```
┌─────────────────────────────────────────────────────────┐
│                         GPU                             │
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│  │   SM0   │  │   SM1   │  │   SM2   │  │  SM143  │   │
│  │         │  │         │  │         │  │         │   │
│  │ Counter │  │ Counter │  │ Counter │  │ Counter │   │
│  │   A0    │  │   A1    │  │   A2    │  │  A143   │   │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘   │
│       │            │            │            │         │
│       └────────────┴─────┬──────┴────────────┘         │
│                          │                              │
│              ┌───────────▼───────────┐                 │
│              │   AGGREGATION BLOCK   │                 │
│              │                       │                 │
│              │  • Sum all SM counters│                 │
│              │  • Compare with shadow│                 │
│              │  • Detect anomalies   │                 │
│              └───────────┬───────────┘                 │
│                          │                              │
│              ┌───────────▼───────────┐                 │
│              │   SHADOW COUNTERS     │                 │
│              │   (redundant path)    │                 │
│              └───────────────────────┘                 │
└─────────────────────────────────────────────────────────┘
```

An attacker must compromise counters across many SMs simultaneously—a single SM counter being reset or frozen is detected by comparison with the aggregate.

## Defense: Sanity Checking

Cross-validate counters against each other:

| Check | Detects |
|-------|---------|
| Instructions issued ≥ instructions retired | Counter underflow attacks |
| Memory accesses ≥ cache misses | Impossible cache behavior |
| FLOP count consistent with instruction count | Selective counter manipulation |
| Power draw correlates with activity counters | Counters frozen while compute active |
| Time elapsed × max throughput ≥ counter value | Counter overflow attacks |

Sanity check failures trigger alerts or automatic throttling.

## Defense: Physical Shielding

| Protection | Mechanism |
|------------|-----------|
| **EM shielding** | Metal layers over counter circuits |
| **Active mesh** | Conductor grid that detects probing |
| **Backside protection** | Shield against through-silicon attacks |
| **Voltage monitoring** | Detect glitch attempts |
| **Temperature monitoring** | Detect thermal attacks |

## Defense: Distributed Aggregation

Don't aggregate all counters in one place:

```
Instead of:
  All SM counters → Single aggregator → Output

Use:
  SM 0-35 → Aggregator A ─┐
  SM 36-71 → Aggregator B ─┼→ Cross-check → Output
  SM 72-107 → Aggregator C ─┤
  SM 108-143 → Aggregator D ┘
```

Compromising a single aggregator only affects 1/4 of the count; cross-checking detects the discrepancy.

## Counter Monotonicity

For governance purposes, counters should only increase:

```
COUNTER UPDATE LOGIC:

new_value = current_value + increment

ASSERT increment ≥ 0
ASSERT new_value ≥ current_value  // overflow check

IF assertion fails:
  - Log anomaly
  - Trigger tamper response
  - Optionally: lock chip until inspection
```

Hardware enforcement prevents any decrement, even via legitimate-looking commands.

## Secure Readout Path

The path from counters to external reporting must also be protected:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   COUNTERS   │────►│  AGGREGATION │────►│   SIGNING    │
│  (protected) │     │  (protected) │     │   ENGINE     │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                          Signed attestation
                                          of counter values
                                                  │
                                                  ▼
                                          External verifier
```

Counter values are signed before leaving the secure domain, preventing manipulation by compromised drivers or firmware.

## Open Questions

- What's the overhead (area, power) of redundant counter infrastructure?
- Can existing GPU counter hardware be hardened, or is a redesign needed?
- How to handle legitimate counter resets (e.g., after chip RMA/repair)?
- What's the false positive rate for sanity checks under normal operation?
- Can formal verification ensure counter logic has no hidden reset paths?

## References

- RAND WR-A3056-1, Chapter 5: Meter Protection
- NVIDIA NSight Compute counter documentation
- Academic literature on fault injection countermeasures
