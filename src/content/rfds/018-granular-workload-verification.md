---
title: "Granular AI Workload Verification"
number: "018"
author: "Romeo Dean"
state: "discussing"
tags: ["verification", "hardware", "logging", "network"]
created: "2024-11-27"
---

## The Idea

Verifying what workloads actually run on an AI cluster is hard: GPT-4 used 10²⁵ FLOPs, frontier runs in 2030 will be 1000× larger, computation happens at extreme frequency on tiny transistors, is irreversible (information destroyed on completion), and often nondeterministic. An idealized setup would record every operation—but this is intractable without hardware overhaul and unacceptable performance penalties.

Instead, we propose "auditor redlines": physical boundaries around compute clusters where **no information crosses without being sent to auditors**. This is enforced via physical inline capture on all network connections crossing the redline, plus airgapping to minimize side-channels. The verification problem then reduces to: *is the information crossing the redline sufficient to verify workloads follow the rules?*

## Why It Matters

This enables a "training-capped regime" where AI companies can fully utilize existing hardware in third-party-monitored training hubs, while auditors have maximal information without overwhelming performance penalties. The key insight: you don't need to log every FLOP—you need to log enough packets (batches) that statistical sampling catches violations with high probability.

## Protocol Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    AUDITOR REDLINE                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              AI COMPANY CLUSTER                      │   │
│  │                                                      │   │
│  │   • No non-volatile memory                          │   │
│  │   • Forced determinism                              │   │
│  │   • Periodic memory wiping                          │   │
│  │   • Compilation happens OUTSIDE redline             │   │
│  │                                                      │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                    │
│              ┌──────────┴──────────┐                        │
│              │  Physical Inline    │                        │
│              │  Capture (all I/O)  │                        │
│              └──────────┬──────────┘                        │
└─────────────────────────┼───────────────────────────────────┘
                          │
                    ┌─────┴─────┐
                    │  AUDITOR  │
                    │    HUB    │
                    └───────────┘
```

## Verification Lifecycle

| Phase | Actor | Action |
|-------|-------|--------|
| **Declaration** | Company | Declares workload with full transparency (code, algorithms, data). Auditors physically can't leak it. |
| **Approval** | Auditor | Runs Workload Approval checks. If pass → sends approval + random seeds (prevents gaming fake randomness). |
| **Logging** | Auditor | Observes complete data flow through redline via inline capture. |
| **During-execution** | Auditor | Random sampling, proof-of-work checks, periodic capability evals to ensure cap isn't crossed. |
| **Submission** | Company | Submits final model weights when ready to release. |
| **Final auditing** | Auditor | Final capability evals, control/safety red-teaming. |
| **Release** | Auditor | Approved weights returned to company, added to whitelist for inference deployment. |

## Defense Layers Inside the Redline

| Layer | Purpose |
|-------|---------|
| **Forced determinism** | Minimize nondeterminism so expected outputs have tiny error margin |
| **No non-volatile memory** | Prevents persistent rogue state |
| **Periodic memory wiping** | Proof-of-memory challenges, forced state reset |
| **External compilation** | Binary/assembly compiled outside redline reduces attack surface for instruction ambiguity |

## Attack Taxonomy & Mitigations

A successful violation requires: (1) undeclared workload runs, and (2) lasting remnant benefits attacker. If rogue computation is reliably deleted, no successful violation.

### Attack Vector 3a: Hide rogue outputs in noise

Attacker hides rogue computation results in outputs, exploiting nondeterminism margin.

**Mitigation**: Force determinism so expected output set is tiny. Proof-of-work recomputation on random samples catches violations with high probability.

### Attack Vector 3b: Covert channels

Smuggle results via side-channels (EM, power, timing, RF).

**Mitigation**: Airgap around redline for side-channel signals. Pad inputs/outputs at inline capture points to mask timing channels.

### Attack Vector 3c: Auditor collusion

Smuggle results by bribing/colluding with auditors.

**Mitigation**: Limit auditor-developer communication. Multiple independent parties with opposing incentives observe all communications.

### Attack Vector: Supply chain

Hardcoded backdoors in hardware inside redline that survive reboot.

**Mitigation**: Hardware audits, trusted supply chain, memory wiping. (Hardest to fully mitigate.)

## Proof-of-Work Recomputation Analysis

### Packet Abstraction

An AI workload = series of packets: `(inputs, instructions, outputs)`

| Logging Regime | Packets Observed |
|----------------|------------------|
| Idealized (every FLOP) | N_packets = FLOPs |
| Our setup (server-rack level) | N_packets = N_batches |

For distributed data parallel (DDP) training with synchronous updates and checkpointing:
- Each mini-batch gradient update = 1 packet
- Packet = (starting weights × input data, training algorithm + auditor seeds, resulting weights)
- **N_packets = N_batches = DATA_SIZE / BATCH_SIZE**

### Detection Probability

Attacker fakes N_FAKE packets out of N_PACKETS total. Auditor verifies N_VERIFIED packets via recomputation.

```
P(verified packet catches fake) = N_FAKE / N_PACKETS

E[detected fakes] = N_VERIFIED × (N_FAKE / N_PACKETS)

N_DETECTED ~ Poisson(N_VERIFIED × F_FAKE)

P(successful violation) = P(N_DETECTED = 0) = e^(-N_VERIFIED × F_FAKE)
```

Where `F_FAKE = N_FAKE / N_PACKETS` (fraction of packets that are fake).

### Required Verification for 99.9% Confidence

```
P(success) < 0.001
e^(-N_VERIFIED × F_FAKE) < 0.001
N_VERIFIED × F_FAKE > -ln(0.001) ≈ 7
```

**Key insight**: Attacks touching fewer packets require more verification to catch.

### Worst-Case Attack: Backdoor via Training Data

Scariest attack: insert backdoor with minimal fake data (e.g., sandbagging on evals, secret loyalties).

| Parameter | Value |
|-----------|-------|
| Backdoor data needed | ~100K tokens |
| Typical frontier training data | 100T tokens |
| F_FAKE | 10⁻⁹ (0.0000001%) |
| N_VERIFIED needed (99.9% confidence) | 7 × 10⁹ packets |

### Computational Cost of Verification

```
COST_FRAC = (BATCH_SIZE × N_VERIFIED) / N_TOKENS
         = 7 × BATCH_SIZE × F_FAKE / N_TOKENS
```

| Batch Size | Verified Packets | Tokens Recomputed | Cost as % of Training |
|------------|------------------|-------------------|----------------------|
| 1000 | 7B | 7T / 100T | **7%** |
| 100 | 7B | 700B / 100T | **0.7%** |

**Takeaway**: Smaller batch sizes → more packets → cheaper verification.

## Reducing Packet Size

Two approaches to get more packets (better verification granularity):

1. **Smaller batches**: More gradient updates, more packets at network level
2. **Lower-level logging**: Track intermediate computations within a batch (e.g., individual matmuls). Requires inline capture *within* server racks or even within GPUs (between RAM and L2 cache).

The ideal limit: bit-level packets (every logic gate operation).

## Open Questions

- **Hardware backdoors**: How to verify hardware inside redline doesn't have hardcoded backdoors that survive memory wipes?
- **Nondeterminism residual**: How much output variance remains after "forced determinism"? Is it small enough for practical verification?
- **Memory wiping protocol**: How often? How to verify completeness? Performance impact?
- **Compilation attack surface**: What instruction-level ambiguities remain even with external compilation?
- **Intermediate logging**: Is within-rack or within-GPU inline capture technically feasible? Cost?

## Relationship to Other RFDs

| RFD | Relationship |
|-----|--------------|
| RFD 017: Inference-Only Verification | Complementary. RFD 017 = "no training allowed"; RFD 018 = "training allowed but verified" |
| RFD 005: Network Tap | RFD 005 is a component of the "physical inline capture" in this proposal |
| RFD 007: Mutually Trusted Cluster | Could be used as the recomputation infrastructure for proof-of-work |
| RFD 013: Network Exhaustion | Related chokepoint strategy |

## References

- [Network Exhaustion Protocol](https://arxiv.org/abs/2511.02620)
- [Inference Verification doc](https://docs.google.com/document/d/17LcWmrsvEl3tj97An1-ufHZ03go7qEpCxqRRegObESY/edit)
