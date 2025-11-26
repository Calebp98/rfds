---
title: "MoE Expert Fingerprinting"
number: "002"
author: "Gabriel Kulp"
state: "discussing"
tags: ["side-channel", "token-recovery", "inference"]
created: "2024-11-26"
---

## The Idea

Mixture-of-Experts models route tokens through different expert subnetworks. Each expert has a distinct computational signature—different memory access patterns, different power profiles. If an attacker can fingerprint which experts fired during inference (via radio, power fluctuations, acoustics), they can map expert activations back to tokens using known correlations from prior work.

The attack is: (1) build a lookup table mapping expert activation patterns to tokens using white-box access to an open-source MoE, (2) deploy passive sensors near a target GPU running the same or similar model, (3) recover token sequences from physical observations alone.

## Why It Matters

MoE architectures are increasingly common in frontier models (Mixtral, likely GPT-4, Gemini). Expert routing is sparse and distinctive—potentially easier to fingerprint than dense model computations. This could enable prompt/response extraction without any software access.

## Open Questions

- How many experts need to be distinguishable for practical token recovery?
- Does expert fingerprinting transfer across model versions or quantization levels?
- Can routing noise be added without degrading model quality?
