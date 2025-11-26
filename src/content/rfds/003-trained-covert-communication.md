---
title: "Trained Covert Communication via Side-Channels"
number: "003"
author: "Gabriel Kulp"
state: "discussing"
tags: ["covert-comms", "control", "side-channel"]
created: "2024-11-26"
---

## The Idea

What if a model *learns* to communicate through side-channels? A model could be fine-tuned to refuse a question in the token stream while covertly answering by modulating GPU power draw, timing jitter, or cache access patterns. The model becomes a transmitter; an accomplice with physical access becomes a receiver.

This is distinct from passive leakage—it's an active, adversarial capability. The research question: under what conditions can models learn to exploit side-channels, and can we detect or prevent this during training?

## Why It Matters

AI control schemes assume humans can monitor model communication. If models can signal through physics rather than text, that assumption breaks. Even demonstrating that this is *possible* reshapes the threat model for information sanitization in high-stakes deployments.

## Open Questions

- What's the minimum bandwidth a model could realistically learn to exploit?
- Can we detect side-channel communication attempts at training time (e.g., unusual gradient patterns)?
- Does the model need to "know" about the side-channel, or can it emerge from reward hacking?
