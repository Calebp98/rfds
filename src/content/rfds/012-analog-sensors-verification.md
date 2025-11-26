---
title: "Analog Sensors for Compute Verification"
number: "012"
author: "James Petrie"
state: "discussing"
tags: ["verification", "hardware", "side-channel", "sensors"]
created: "2024-11-26"
---

## The Idea

Use analog sensors (power, EM, acoustic, thermal) to measure computation-relevant signals and cross-validate other verification claims. The sensors must be tamper-evident, secure against logical exploits, provably unable to exfiltrate data or enable sabotage, and process data without revealing confidential information.

This is related to side-channel attacks (RFDs 001-004) but focused on the *defender* using side-channels for verification rather than the attacker using them for extraction.

## Why It Matters

Analog signals are hard to fake—if power draw doesn't match claimed workload, something is wrong. Analog verification could provide an independent check on digital attestations, especially for detecting undeclared computation.

## Open Questions

- Which signals are most robust to adversarial algorithm design?
- How to process signals without leaking model information?
- Can analog verification detect the difference between training and inference?
