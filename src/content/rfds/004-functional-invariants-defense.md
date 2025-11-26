---
title: "Functional Invariants for Side-Channel Defense"
number: "004"
author: "Gabriel Kulp"
state: "idea"
tags: ["defense", "side-channel", "weight-security", "noise"]
created: "2024-11-26"
---

## The Idea

Neural networks have functional invariants—transformations that don't change input-output behavior but do change internal representations (weight permutations, rescaling, etc.). Can we exploit these to add noise to computation without degrading task performance?

The goal is to find the minimum signal-to-noise ratio that makes side-channel extraction impractical while preserving model quality. This could enable safer deployment on semi-trusted infrastructure where physical access can't be prevented.

## Why It Matters

Weight theft lets adversaries strip safeguards. If we can make extraction 10x or 100x harder through principled noise injection, that's a meaningful security improvement even if it's not a complete solution.

## Open Questions

- Which invariants offer the most "free" noise?
- How does defense interact with quantization and other efficiency techniques?
- Is there a fundamental tradeoff between side-channel resistance and inference speed?
