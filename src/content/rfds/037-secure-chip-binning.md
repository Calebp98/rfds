---
title: "Secure Chip Binning and Feature Lockout"
number: "037"
author: "RAND Corporation"
state: "idea"
tags: ["verification", "hardware"]
created: "2024-11-27"
---

## The Idea

When chips are "binned" into different product tiers (e.g., RTX 4090 vs RTX 4080), disabled features often remain physically present on the die—just fused off or disabled in firmware. An attacker with sufficient resources could potentially re-enable these features, bypassing governance mechanisms that rely on the disabled configuration.

For governance-critical chips, disabled features should be physically absent or designed such that re-enabling them is infeasible. This may require manufacturing separate dies for different product tiers rather than binning from a common die.

## Why It Matters

If a "safe" chip variant (e.g., limited interconnect, reduced compute) can be modified to become a "restricted" variant, export controls and governance mechanisms are undermined. The attacker's cost to upgrade a chip must exceed the cost of acquiring the restricted variant through legitimate (or illegitimate) channels.

## Current Binning Practices

```
MANUFACTURING PROCESS:

1. Fabricate dies with maximum feature set

2. Test each die for defects and performance

3. Based on test results, assign to product tier:
   - Top tier: All features enabled
   - Mid tier: Some features disabled (fused off)
   - Low tier: More features disabled

4. Sell at different price points
```

This is economically efficient—one mask set, multiple products—but creates security vulnerabilities.

## Vulnerability: Feature Re-enablement

| Disabled Feature | Disabling Method | Re-enablement Difficulty |
|------------------|------------------|--------------------------|
| Compute units (SMs) | Fuse blow | Moderate (FIB to bypass fuse) |
| Tensor cores | Firmware flag | Low (firmware modification) |
| Memory channels | Fuse blow | Moderate to High |
| Interconnect bandwidth | Firmware/fuse | Varies by implementation |
| Clock speed limits | Firmware | Low |

Features disabled only in firmware are especially vulnerable—a compromised driver can re-enable them without any physical attack.

## Secure Approaches

### Option 1: Separate Dies

```
Instead of:
  One die → binned into Products A, B, C

Use:
  Die A (full features) → Product A only
  Die B (features physically absent) → Product B only
  Die C (more features absent) → Product C only
```

**Pros**: No dormant features to re-enable
**Cons**: Higher manufacturing cost (multiple mask sets), lower yield utilization

### Option 2: Irreversible Disablement

```
SECURE FUSING:

1. Disabled features have power rails cut by antifuses

2. Antifuse state verified by on-chip self-test

3. Self-test result signed and reported at boot

4. Bypass attempts trigger tamper response
```

**Pros**: Single die, but re-enablement requires physical modification
**Cons**: Still vulnerable to sophisticated FIB attacks

### Option 3: Cryptographic Binding

```
FEATURE ACTIVATION:

1. Each feature set requires a signed activation token

2. Tokens are per-device and per-feature

3. Higher-tier features require tokens not issued for lower-tier products

4. Tokens verified against fused public key
```

**Pros**: Software-based but cryptographically protected
**Cons**: Token distribution infrastructure; stolen tokens are reusable

### Option 4: PUF-Bound Features

```
FEATURE BINDING:

1. Feature activation keys derived from device PUF + feature ID

2. Manufacturer records PUF responses for purchased tier only

3. Higher-tier features require PUF responses manufacturer never recorded

4. Can't activate features without knowing correct PUF response
```

**Pros**: No tokens to steal; device-specific
**Cons**: Complex manufacturing process; PUF stability requirements

## Recommendations for Governance Chips

The RAND paper recommends:

1. **No dormant restricted features**: If a feature would make the chip governance-restricted, it should be physically absent from chips sold as unrestricted

2. **Audit chip designs**: Governance authorities should have access to verify that restricted features are truly absent, not just disabled

3. **Secure fusing for performance limits**: Features like clock speed and memory bandwidth that are limited (not removed) should use fusing protected against bypass

4. **Firmware-only limits are insufficient**: Any limit that relies solely on firmware can be bypassed by an attacker with firmware access

## Verification Challenges

How can a governance authority verify that a chip doesn't have dormant restricted features?

| Method | What It Reveals | Limitations |
|--------|-----------------|-------------|
| **X-ray imaging** | Physical layout at macro level | May not resolve all features |
| **Decapping + optical imaging** | Surface features | Doesn't show all metal layers |
| **Full delayering** | Complete layout | Destroys chip; expensive |
| **Comparison to design files** | Layout matches specification | Requires manufacturer cooperation |
| **Functional testing** | What features actually work | Dormant features may not respond |

Complete verification likely requires manufacturer cooperation to provide reference layouts or to allow inspection of manufacturing process.

## Open Questions

- What's the cost premium for separate dies vs. binning?
- Can verification authorities realistically inspect chip layouts?
- How to handle chips that are legitimately sold at one tier but later RMA'd to another?
- Are there legitimate use cases for software-limited features that governance should accommodate?
- How to handle feature unlocking that's legitimately sold (like Intel On Demand)?

## References

- RAND WR-A3056-1, Chapter 5: Cyber Defense and Defense in Depth
- GPU product stack and binning practices (public teardowns)
- Intel On Demand (legitimate software feature unlocking)
