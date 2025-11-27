---
title: "Location Verification for AI Compute"
number: "026"
author: "Amodo / Tim Fist"
state: "idea"
tags: ["verification", "hardware"]
created: "2024-11-27"
---

## The Idea

Prove *where* AI computation physically occurs. For international agreements (e.g., Gulf negotiations), parties need assurance that compute nominally located in a "neutral" or "verified" jurisdiction is actually running there, not secretly redirected to an unmonitored facility.

Location verification could use: GPS/GNSS with anti-spoofing, network latency triangulation, physical inspection regimes, or cryptographic attestation tied to hardware installed at known locations. The challenge is making this robust against nation-state adversaries who control local infrastructure.

## Why It Matters

Many verification schemes assume you know where the hardware is. "Inference-only clusters in third-party jurisdictions" or "training hubs under joint monitoring" only work if location claims are credible. Location verification is a foundational primitive for international compute governance.

## Open Questions

- What's the threat model? Spoofed GPS? Compromised network infrastructure?
- Can latency measurements distinguish datacenters 100km apart?
- How does location verification interact with secure enclaves?
- What physical inspection regime is practical for continuous verification?

## Status

Amodo planning demo for policy stakeholders. Tim Fist advising on specifications.

## References

- Gulf negotiations context (policy window 2025)
- Related: RFD 017 (Inference-Only Verification Package)
