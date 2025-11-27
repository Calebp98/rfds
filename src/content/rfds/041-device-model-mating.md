---
title: "Device-Model Mating for AI-Enabled Weapons"
number: "041"
author: "Oxford Martin AI Governance Initiative"
state: "idea"
tags: ["verification", "hardware", "cryptography", "physical-security"]
created: "2024-11-27"
---

## The Idea

Hardware mechanisms that permanently bind a specific AI model to a specific device, such that:

1. The model cannot be feasibly copied to run on other hardware
2. The hardware cannot be repurposed to run a different model

Implementation uses PUF-protected encryption: during a verified loading process, the model is encrypted with a key derived from the device's unique physical properties. Only that specific device can decrypt and execute the model.

## Why It Matters

The "software update problem" for autonomous weapons: after a weapon system passes verification, what prevents the operator from updating it to a non-compliant configuration? Device-model mating creates a hardware-enforced commitment that the verified model is the only model that can run.

This enables arms control agreements covering AI-enabled weapons by providing cryptographic proof that deployed systems match their verified configurations.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│            VERIFIED LOADING FACILITY                    │
│                                                         │
│  ┌─────────────┐      ┌─────────────────────────────┐  │
│  │   MODEL M   │      │      DEVICE D               │  │
│  │  (plaintext)│      │  ┌─────────────────────┐   │  │
│  │             │──────┼─►│   PUF-DERIVED KEY   │   │  │
│  │             │      │  │   K = f(PUF_D)      │   │  │
│  └─────────────┘      │  └──────────┬──────────┘   │  │
│                       │             │               │  │
│                       │  ┌──────────▼──────────┐   │  │
│                       │  │  ENCRYPTED MODEL    │   │  │
│                       │  │  E_K(M)             │   │  │
│                       │  │  (stored in device) │   │  │
│                       │  └─────────────────────┘   │  │
│                       └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                              │
                              │ Device deployed
                              ▼
┌─────────────────────────────────────────────────────────┐
│                  OPERATIONAL USE                        │
│                                                         │
│  • Device D can decrypt E_K(M) using its PUF           │
│  • No other device can derive K (PUF is unique)        │
│  • Device D cannot load different model M'             │
│    (would need E_K(M') created at verified facility)   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## PUF Requirements

The PUF must:

| Property            | Requirement                                            |
| ------------------- | ------------------------------------------------------ |
| **Unique**          | Different devices produce different keys               |
| **Stable**          | Same device produces same key over time                |
| **Unclonable**      | Cannot manufacture a device with the same PUF response |
| **Tamper-evident**  | Physical intrusion changes PUF response                |
| **Stress-tolerant** | Operational conditions don't alter the key             |

Challenge: Military systems experience vibration, temperature extremes, shock. PUF must remain stable under these conditions while still detecting tampering.

## Secure Enclosure Design

The PUF-protected boundary must:

- Encompass all components that access decrypted model
- Prevent probing of internal signals
- Trigger key destruction on breach
- Survive operational environment

Options:

- Chip-level enclosure (most secure, hardest to implement)
- Board-level potting with active mesh
- Module-level with environmental monitoring

## Verification Protocol

```
1. DEVICE manufactured with unique PUF

2. DEVICE brought to Verification Facility
   - Both Prover and Verifier present
   - PUF response measured and recorded

3. MODEL verified as compliant
   - Capability evaluation
   - Safety testing
   - Rule compliance check

4. MODEL encrypted with device's PUF-derived key
   - Encryption performed in verified environment
   - Neither party has plaintext after loading

5. DEVICE sealed
   - Tamper-evident enclosure activated
   - Any breach invalidates PUF key

6. DEVICE deployed
   - Can execute only the mated model
   - Verifier can later check device still sealed
```

## Wreckage Inspection

Post-incident verification:

- Examine device enclosure for tampering
- If intact, PUF response should match recorded value
- Attestation of loaded model fingerprint (if hardware survived)
- Even damaged hardware may provide partial verification

## Open Questions

- Can PUF enclosures withstand military operational stresses (G-forces, temperature cycling, humidity) without invalidating keys?
- How to handle legitimate software updates within this framework? (Security patches, bug fixes)
- What verification process is needed during model loading to ensure neither party can substitute a different model?
- Can this work with encrypted models where even the Verifier doesn't see plaintext weights?
- How to handle model updates that are genuinely needed for safety or security?
- What's the failure mode if PUF degrades over time?
- Can an adversary with resources of a nation-state clone a PUF?

## References

- Oxford Martin source document Section 4.5.2.3.6.c
- Appendix K on device-model mating approaches
- Immler et al. 2019 on secure physical enclosures
- Obermaier & Immler 2018 PUF survey
