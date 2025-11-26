---
title: "Nonconfidential Verification (Red Team/Blue Team)"
number: "011"
author: "James Petrie"
state: "idea"
tags: ["verification", "protocol", "adversarial", "logging"]
created: "2024-11-26"
---

## The Idea

If data confidentiality isn't required, verification becomes a log analysis problem: the verifier gets detailed logs from thousands of devices (most not individually trusted) and must detect fabrication.

Test this with red team/blue team exercises: Red teams are randomly assigned compliant or noncompliant, make workload claims, and can comply with data requests, reject them, or falsify data. Blue teams analyze data and rank red teams by suspicion. Incentive structures reward not being ranked suspicious.

## Why It Matters

Many verification schemes assume confidentiality constraints that may not apply in all contexts (e.g., government-owned compute, safety-critical deployments). Understanding what's possible without confidentiality constraints maps the verification frontier.

## Open Questions

- What log fabrication attacks are hardest to detect?
- How much cross-device correlation is needed to catch fabrication?
- Can this approach scale to thousands of GPUs?
