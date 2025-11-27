---
title: "Tamper-Evident Secure Enclosure for Accelerators"
number: "020"
author: "FlexHEG"
state: "idea"
tags: ["verification", "hardware", "physical-security"]
created: "2024-11-27"
---

## The Idea

A secure enclosure protects flexHEG components from physical tampering. The boundary can be at chip-level, board-level, tray-level, or rack-level, with different tradeoffs. For verification use cases, tamper-evidence (detecting that tampering occurred) is sufficient. For enforcement use cases (guarantees about future usage), tamper-response (triggering accelerator disablement before circumvention) is needed.

The core challenge: AI accelerators dissipate up to 1200W per chip and require liquid cooling. The enclosure must allow heat transfer while preventing physical access to signals, and must operate reliably for years without maintenance access.

## Why It Matters

Without physical security, all software/firmware guarantees can be bypassed by an attacker with screwdrivers and an oscilloscope. Secure enclosures are mature technology for cryptographic coprocessors (FIPS-140-4 certified devices exist), but haven't been adapted for high-power AI accelerators. Solving the thermal/form-factor challenge enables hardware-backed verification.

## Enclosure Types

| Type | Mechanism | Use Case |
|------|-----------|----------|
| **Tamper-evident** | Seals, cameras, visual inspection | Verification with periodic inspection |
| **PUF-based** | Physically Unclonable Function derives keys from enclosure properties; tampering corrupts key | Passive (no battery), but key regeneration is slow |
| **Tamper-responsive** | Active sensors trigger disablement on breach | Enforcement of future guarantees |

## Sensing Methods

- **Capacitance measurement**: Serpentine conductor pattern, detect changes from probing
- **Resistance mesh**: Conductor grid, detect cuts or shorts
- **RF response**: Measure radio characteristics inside enclosure, detect metallic intrusions
- **Environmental**: Radiation, voltage glitching, laser, temperature, temperature rate-of-change

## Tamper Response Options

| Method | Pros | Cons |
|--------|------|------|
| **Capacitor discharge** | Simple, retrofittable, destroys chip with voltage surge | Requires charged capacitors |
| **Antifuse bits** | Millions of OTP cells throughout chip, triggered activation renders chip inoperable | Requires deep integration at design time |
| **Nanothermite** | Rapid exothermic reaction physically destroys components | Experimental, safety concerns |

## Cooling Compatibility

Two approaches for liquid-cooled systems:
1. **Sandwich**: Enclosure boundary between chip and cold plate (must be very thin, very thermally conductive)
2. **Contain cooling**: Liquid tubing inside enclosure, heat exchange at boundary via liquid-liquid exchanger

For air-cooled: metalized foam allowing airflow but no line-of-sight, geometry sensed by RF.

## Scale Considerations

| Enclosure Size | Pros | Cons |
|----------------|------|------|
| Chip-level | Small attack surface, integrated early in supply chain | Requires advanced tooling to design |
| Board-level | Matches existing form factors | More surface area for flaws |
| Rack-level | Easiest to deploy | Single breach exposes many GPUs, maintenance problematic |

## Open Questions

- Can existing FIPS-140-4 enclosure technology be adapted for 1200W thermal loads?
- What's the marginal per-device cost of circumvention for nation-state attackers?
- How to handle maintenance if enclosure cannot be opened?
- Can two-layer enclosures (one from each party) reduce bilateral trust requirements?

## References

- [FIPS-140 Cryptographic Module Validation Program](https://csrc.nist.gov/projects/cryptographic-module-validation-program)
- [IBM 4758 cryptographic coprocessor breach](https://www.cl.cam.ac.uk/~rnc1/descrack/)
- [PUF survey: Obermaier & Immler 2018](https://doi.org/10.1007/s41635-018-0045-2)
- [Raspberry Pi RP2350 security challenge results](https://www.raspberrypi.com/news/security-through-transparency-rp2350-hacking-challenge-results-are-in/)
