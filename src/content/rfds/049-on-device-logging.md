---
title: "On-Device Logging for AI Weapons Verification"
number: "049"
author: "Oxford Martin AI Governance Initiative"
state: "idea"
tags: ["verification", "logging", "cryptography", "physical-security"]
created: "2024-11-27"
---

## The Idea

AI-enabled weapons log key operational information with cryptographic commitments during use. The device stores commitments locally; the actual data (plaintext) can be revealed at a time and place chosen by the Prover—potentially years after operations.

This enables verification of compliance with international humanitarian law and rules on autonomous weapons without requiring real-time disclosure of sensitive military operations.

## Why It Matters

Real-time monitoring of military AI systems is politically and operationally infeasible—it would reveal troop positions, operational plans, and intelligence sources. But without any verification, agreements on autonomous weapons are unenforceable.

Delayed verification via on-device logging threads this needle: operations remain secret during execution, but compliance can be proven later. Even delayed verification creates deterrence, since violations will eventually be detectable.

## What Gets Logged

| Data Type | Purpose | Sensitivity |
|-----------|---------|-------------|
| Sensor inputs | Prove what the system "saw" | High (reveals capabilities) |
| Model decisions | Prove reasoning chain | Medium |
| Targeting data | Prove target selection criteria | Very high |
| Human interactions | Prove human-in-the-loop compliance | High |
| Engagement outcomes | Prove effects of actions | High |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   AI-ENABLED WEAPON                     │
│                                                         │
│  ┌─────────────┐      ┌─────────────────────────────┐  │
│  │   SENSORS   │─────►│      AI MODEL               │  │
│  └─────────────┘      │  (decision-making)          │  │
│                       └───────────┬─────────────────┘  │
│                                   │                     │
│                       ┌───────────▼─────────────────┐  │
│                       │     LOGGING MODULE          │  │
│                       │                             │  │
│                       │  For each decision:         │  │
│                       │  1. Record plaintext P      │  │
│                       │  2. Compute commitment C(P) │  │
│                       │  3. Store P in secure NVM   │  │
│                       │  4. Optionally transmit C   │  │
│                       └───────────┬─────────────────┘  │
│                                   │                     │
│                       ┌───────────▼─────────────────┐  │
│                       │   TAMPER-RESISTANT STORAGE  │  │
│                       │   [P1, C1], [P2, C2], ...   │  │
│                       └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Commitment Protocol

```
For each logged event:

1. RECORD plaintext P (sensor data, decision, outcome)

2. GENERATE random nonce N

3. COMPUTE commitment C = Hash(P || N || timestamp || device_id)

4. STORE locally: (P, N, timestamp)

5. OPTIONALLY TRANSMIT: C
   (commitment can be sent without revealing P)

Later, for verification:

6. PROVER reveals (P, N, timestamp) for selected events

7. VERIFIER computes Hash(P || N || timestamp || device_id)

8. VERIFIER checks: computed hash == previously received C
```

## Commitment Transmission Options

| Approach | Pros | Cons |
|----------|------|------|
| Continuous transmission | Commitments exist externally; can't be deleted | Reveals operational tempo, risks location leak |
| Periodic bundles | Less revealing of operations | Delay in establishing commitments |
| Post-operation dump | Minimal operational security risk | All commitments made after the fact (less trustworthy) |
| No transmission | Maximum operational security | Relies entirely on tamper-resistant storage |

## Storage Requirements

| Component | Data Rate | 1-Year Storage |
|-----------|-----------|----------------|
| Sensor frames (compressed) | ~1 MB/min active | ~500 GB |
| Decision logs | ~1 KB/decision | ~1 GB |
| Commitments only | ~100 bytes/event | ~100 MB |

Requires ruggedized, tamper-resistant nonvolatile storage capable of surviving combat conditions.

## Verification Process

```
1. DEVICE returned to Verification Facility
   (or inspected in field with appropriate equipment)

2. STORAGE INTEGRITY verified
   - Tamper-evident seals checked
   - Hardware attestation of storage integrity

3. COMMITMENTS MATCHED (if transmitted during operation)
   - Revealed data must match prior commitments

4. PRIVACY-PRESERVING ANALYSIS
   - Neutral facility examines logs
   - Checks compliance with agreed rules
   - Reports only compliance/non-compliance
   - Does not reveal sensitive operational details to adversary
```

## Rules That Could Be Verified

- Human authorization required before engagement
- Target discrimination criteria met (distinguish combatants from civilians)
- Proportionality assessment performed
- No engagement in prohibited zones
- Correct identification of target type
- Minimum decision time thresholds

## Open Questions

- How much storage is required for operationally meaningful logging? Can it fit in weapon form factors?
- Can privacy-preserving evaluation techniques (ZKP, MPC) operationalize complex legal requirements like "proportionality"?
- What time delay between operations and verification is acceptable? (Months? Years?)
- How to prevent Prover from tampering with logs before verification?
- What happens if storage is destroyed in combat?
- How to handle classified information in logs during verification?
- Who performs the verification? (Neutral party? Adversary? International body?)

## Relationship to Other RFDs

| RFD | Relationship |
|-----|--------------|
| RFD 048 (Device-Model Mating) | Mated devices with logging provide both model and behavior guarantees |
| RFD 020 (Tamper-Evident Enclosure) | Storage must be in tamper-resistant enclosure |
| RFD 037 (Containerized Data Centers) | Similar delayed-verification concept for larger systems |

## References

- Oxford Martin source document Section 4.5.2.3.6.d
- Gubrud and Altmann 2013 on compliance measures for autonomous weapons
- IPRAW 2019 on verifying LAWS regulation
- Geneva Conventions and Additional Protocols (legal framework)
