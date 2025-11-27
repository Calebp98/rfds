---
title: "Containerized Data Centers for Mobile/Military AI"
number: "038"
author: "Oxford Martin AI Governance Initiative"
state: "idea"
tags: ["verification", "hardware", "physical-security"]
created: "2024-11-27"
---

## The Idea

Self-contained data centers in standard shipping containers that are verifiable while protecting location information. The container is verified in a controlled facility, sealed with tamper-evident mechanisms, and then deployed to any location while maintaining continuous digital verification contact.

Key innovation: the container's physical location remains secret, but its computational behavior remains verifiable through encrypted monitoring channels that don't leak location.

## Why It Matters

Military AI assets face an acute transparency-security tradeoff—revealing the location of AI-enabled command systems or weapons platforms is unacceptable. Containerized verification allows robust rule enforcement while keeping hardware physically hidden. This enables military participation in international AI governance agreements that would otherwise be blocked by security concerns.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│              SHIPPING CONTAINER ENCLOSURE               │
│  ┌───────────────────────────────────────────────────┐ │
│  │              PUF-BASED SHELL                      │ │
│  │  (tamper detection via physical properties)       │ │
│  │  ┌─────────────────────────────────────────────┐ │ │
│  │  │           COMPUTE HARDWARE                  │ │ │
│  │  │  • GPU cluster (inference-capable)          │ │ │
│  │  │  • Guarantee Processor                      │ │ │
│  │  │  • Tamper-evident internal sensors          │ │ │
│  │  └─────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────┘ │
│                         │                               │
│              ┌──────────┴──────────┐                   │
│              │  NETWORK GATEWAY    │                   │
│              │  (location-hiding   │                   │
│              │   encrypted comms)  │                   │
│              └──────────┬──────────┘                   │
└─────────────────────────┼───────────────────────────────┘
                          │
                    Encrypted Channel
                    (location obfuscated)
                          │
                    ┌─────┴─────┐
                    │  VERIFIER │
                    └───────────┘
```

## Verification Lifecycle

| Phase           | Location              | Actions                                                  |
| --------------- | --------------------- | -------------------------------------------------------- |
| **Assembly**    | Verification Facility | Hardware verified by both parties, PUF baseline recorded |
| **Sealing**     | Verification Facility | Container sealed, tamper-evident shell activated         |
| **Deployment**  | Secret                | Container moved to operational location                  |
| **Operation**   | Secret                | Continuous encrypted monitoring, workload verification   |
| **Maintenance** | Verification Facility | If needed, return to facility for verified repairs       |

## Tamper Detection

The container shell uses PUF-based security:

- Physical properties of the enclosure (capacitance, RF response) form a unique signature
- Any physical intrusion changes these properties
- Continuous or periodic measurement detects tampering
- Tamper event → alert to Verifier, optional self-disable

## Location Obfuscation

Monitoring data must not leak location:

- All timestamps normalized or jittered
- Traffic patterns padded to prevent timing analysis
- Multiple routing paths to prevent triangulation
- No GPS or location metadata in any transmissions

## Thermal/Power Considerations

Shipping container constraints:

- Standard 20ft or 40ft container form factors
- Liquid cooling pass-through required for GPU density
- Power delivery (potentially multi-MW for large clusters)
- Redundancy for operation without maintenance access

## Open Questions

- Can monitoring data streams be fully protected against location triangulation by sophisticated adversaries?
- How to handle hardware malfunctions requiring return to verification facility? (Downtime, logistics)
- What level of agreement granularity is possible? (Byte-level verification vs. aggregate attestation)
- Can PUF enclosures withstand operational stresses (transport vibration, temperature extremes) without triggering false positives?
- What's the minimum viable container size for useful AI capability?
- How to handle power and cooling in field deployments?

## References

- Oxford Martin source document Section 2.5.4.2
- Section 1.5.1.1 on location information sensitivity
- Standard shipping container specifications (ISO 668)
