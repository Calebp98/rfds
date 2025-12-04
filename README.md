# AI Security RFDs

Research ideas and open problems in AI security, verification, and governance.

This process is inspired by [Oxide's RFD process](https://oxide.computer/blog/rfd-1-requests-for-discussion).

## What is an RFD?

An RFD is a lightweight document that captures an idea, explores a problem, or proposes a direction. The goal is to get ideas written down where others can engage with them—rough is fine.

## RFD States

| State | Meaning |
|-------|---------|
| `idea` | Initial writeup, open for feedback |
| `discussing` | Discussion is especially helpful |
| `abandoned` | No longer being pursued |

All RFDs remain open for discussion regardless of state.

## Contributing

### Commenting on an RFD

To discuss any RFD—whether it's a new idea or already published—open an issue or PR on GitHub.

### Proposing a new RFD

1. Fork/clone the repo and create a branch
2. Copy `rfd/0000-template.md` to `rfd/NNNN-short-title.md` (next available number)
3. Fill in the frontmatter and write your idea
4. Open a PR — discussion happens there
5. Once it's ready, merge to main

### Format

```markdown
---
title: "Your Title Here"
number: "042"
author: "Your Name"
state: "idea"
tags: ["relevant", "tags"]
created: "YYYY-MM-DD"
---

## The Idea

What's the core concept?

## Why It Matters

Why should people care?

## Open Questions

What's unresolved?

## References

Links to papers, prior art, related RFDs.
```

## Topic Areas

Current RFDs cover:
- **Side-channels**: GPU power/EM leakage, MoE fingerprinting, covert communication
- **Hardware verification**: Network taps, secure enclaves, tamper detection, trusted logging
- **Cryptographic approaches**: ZK proofs, attestation, offline licensing
- **Governance infrastructure**: Chip registries, location verification, workload discrimination

## License

This work is licensed under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/). You're free to use, share, and adapt these ideas — just give credit.
