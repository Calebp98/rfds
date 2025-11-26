---
title: "Side-Channel Leakage from LLM Inference"
number: "001"
author: "Gabriel Kulp"
state: "discussing"
tags: ["side-channel", "hardware", "inference-security", "weight-theft"]
created: "2024-11-26"
---

## The Idea

GPUs leak information through physical side-channels—power draw, electromagnetic emissions, acoustics, even thermal signatures. Prior work has shown this for CPUs and cryptographic hardware, but GPU-based LLM workloads remain largely unstudied despite being the backbone of modern AI infrastructure.

We hypothesize that practical attacks can recover: the full text of prompts, presence/absence of specific tokens, output logits, semantic categories ("is this conversation about X?"), and potentially the "true" response behind a refusal. The experimental setup is a frontier accelerator (H100/B100) with oscilloscopes on power rails, EM probes near the die, and software-accessible sensors—all correlated with PyTorch execution in a single notebook.

## Why It Matters

As models grow more valuable and deploy in shared data centers, even partial leakage has serious safety and national-security implications. This is a major blind spot: GPUs have received almost no physical security scrutiny compared to CPUs or HSMs.

## Open Questions

- Which side-channel (power, EM, acoustic, thermal) offers the best SNR for different attack targets?
- How much does model architecture (dense vs MoE) affect leakage surface?
- Can attacks work through virtualization layers in cloud environments?

## References

- [Gregersen et al., "Input-Dependent Power Usage in GPUs"](https://arxiv.org/abs/2409.18324)
- [Maia et al., weight extraction via EM](https://arxiv.org/abs/2312.07783)
- [Token recovery from LLM side channels](https://arxiv.org/abs/2508.15036)
- [On-chip sensor leakage](https://arxiv.org/abs/2309.11894)
- [Weight leakage via EM](https://arxiv.org/abs/2211.05590)
- [Thonking blog: matrix multiplication power draw](https://www.thonking.ai/p/strangely-matrix-multiplications)
