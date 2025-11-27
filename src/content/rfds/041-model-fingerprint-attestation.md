---
title: "Model Fingerprint Attestation"
number: "041"
author: "Oxford Martin AI Governance Initiative"
state: "idea"
tags: ["verification", "inference", "attestation", "cryptography", "hardware"]
created: "2024-11-27"
---

## The Idea

A hardware mechanism to credibly prove that a specific model is currently loaded into GPU memory. Goes beyond simple remote attestation by using challenge-response computations that can only be completed by a chip with the claimed model already in memory.

The key insight: model loading takes seconds to minutes for large models. If the challenge-response window is shorter than model swap time, the hardware cannot fake having a different model loaded.

## Why It Matters

Verification regimes need to know that deployed models match those that passed compliance testing. Without fingerprint attestation, an operator could:
- Load an approved model for verification, then swap to an unapproved model
- Claim to run Model A while actually running Model B
- Strip safety fine-tuning from a model post-approval

Model fingerprint attestation closes this gap by proving model identity at inference time.

## Protocol Sketch

```
1. VERIFIER generates random challenge C
   (must be unpredictable to Prover)

2. CHALLENGE sent to hardware
   (timing window W starts)

3. HARDWARE computes response R = f(C, M)
   where M = model weights in memory
   f is a function that:
   - Requires model weights to compute
   - Cannot be precomputed for all challenges
   - Completes in time < W

4. RESPONSE R sent to Verifier
   (must arrive before window W expires)

5. VERIFIER checks:
   - R arrived within window W
   - R matches expected value for model M and challenge C
   - W < minimum model swap time
```

## Challenge Function Requirements

The function f(C, M) must satisfy:

| Property | Requirement |
|----------|-------------|
| **Model-dependent** | Different models produce different responses |
| **Challenge-dependent** | Different challenges produce different responses |
| **Fast to compute** | Completes in milliseconds with model in memory |
| **Slow to fake** | Cannot compute without model in memory |
| **Deterministic** | Same inputs always produce same output |

Candidate approaches:
- Hash of (challenge XOR specific weight tensors)
- Forward pass on challenge-derived input, hash of activations
- Custom cryptographic construction using weights as key material

## Timing Analysis

| Operation | Approximate Time |
|-----------|------------------|
| H100 HBM bandwidth | 3.35 TB/s |
| Load 1TB model to HBM | ~300ms |
| Load 100GB model to HBM | ~30ms |
| Challenge-response target | <10ms |

For a 1TB model, a 100ms challenge window provides ~3x margin against model swapping.

## Hardware Requirements

- Trusted execution environment or Guarantee Processor
- Secure random number generator for challenges
- Precise timing measurement
- Tamper-evident to prevent clock manipulation

## Attack Vectors & Mitigations

| Attack | Mitigation |
|--------|------------|
| Precompute responses for all challenges | Challenge space too large (256-bit) |
| Keep multiple models in memory | Memory capacity limits; can require memory exhaustion |
| Partial model loading | Challenge function must touch weights across entire model |
| Clock manipulation | Hardware-attested timestamps, external timing verification |
| Proxy to faster hardware | Latency bounds, network monitoring |

## Open Questions

- Can a challenge function be designed that provably requires the full model in memory?
- What's the minimum challenge-response window that prevents model swapping for various model sizes?
- How to handle models that differ only slightly (fine-tuned variants)?
- Can this work even if hardware roots of trust are compromised?
- How to scale to simultaneous challenges across thousands of GPUs without excessive slowdown?
- What about models split across multiple GPUs (tensor parallelism)?

## Relationship to Other RFDs

| RFD | Relationship |
|-----|--------------|
| RFD 014 (Memory Exhaustion) | Memory exhaustion + fingerprinting prevents hidden model storage |
| RFD 019 (Guarantee Processor) | GP could implement fingerprint attestation |
| RFD 021 (Interlock Architecture) | Interlock sees model loading, could enforce fingerprinting |
| RFD 047 (Model Tenancy Ledger) | Ledger records fingerprints; attestation proves current state |

## References

- Oxford Martin source document Appendix L.4
- Remote attestation and confidential computing foundations
- NVIDIA Confidential Computing documentation
