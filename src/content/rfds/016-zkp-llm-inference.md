---
title: "Zero-Knowledge Proofs for LLM Inference"
number: "016"
author: "James Petrie"
state: "idea"
tags: ["verification", "cryptography", "zkp", "inference"]
created: "2024-11-26"
---

## The Idea

Use zero-knowledge proofs to verify that inference was performed correctly without revealing model weights or inputs. Recent work (zkLLM, zkTorch, zkGPT) has made progress on this, but practical deployment for frontier models remains distant.

Open attack: "Hollow-LLM" shows that computationally trivial weights can pass ZK verification, undermining the guarantee that a real model was used.

## Why It Matters

ZKPs offer the strongest possible verification guarantee—mathematical proof rather than physical security. If practical, they would obsolete most hardware-based verification. Understanding their limits helps prioritize the verification research agenda.

## Open Questions

- What's the current overhead for ZK-verified inference?
- Can Hollow-LLM style attacks be prevented?
- Is there a hybrid approach (ZKP + hardware) that's practical sooner?

## References

- [zkLLM](https://dl.acm.org/doi/10.1145/3658644.3690304)
- [zkTorch](https://arxiv.org/abs/2507.07031)
- [zkGPT](https://www.usenix.org/conference/usenixsecurity25)
- [ZKML optimizing system](https://dl.acm.org/doi/10.1145/3627703.3629556)
- Hollow-LLM Attack (unpublished, Gong et al.)
