---
title: "Inference-Only Verification Package"
number: "017"
author: "Romeo Dean"
state: "discussing"
tags: ["verification", "hardware", "inference", "physical-security"]
created: "2024-11-27"
---

## The Idea

AI training and inference have different hardware requirements: training coordinates across entire clusters via high-speed interconnect, while even frontier models can serve inference from single servers. An inference-only verification package exploits this asymmetry by physically removing interconnect from clusters, then verifying that individual servers are doing legitimate inference rather than participating in distributed training.

The verification problem reduces to: (1) ensuring interconnect isn't reintroduced (physical monitoring, tamper-evident cameras), and (2) ensuring each server is doing whitelisted inference, not contributing to a rogue training run that coordinates over the internet (e.g., expert iteration with gradient updates happening elsewhere).

## Why It Matters

If you can verifiably distinguish inference-only clusters from training-capable clusters, you can enforce compute governance at the hardware level. This enables scenarios like: mutual US-China verification that neither is doing undeclared frontier training, or domestic enforcement that licensed inference providers aren't secretly training. The key insight is that interconnect removal is fast, cheap, and hard to reverse covertly.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      DATACENTER                         │
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
│  │ Server  │  │ Server  │  │ Server  │  ...            │
│  │(no NVMe)│  │(no NVMe)│  │(no NVMe)│                 │
│  └────┬────┘  └────┬────┘  └────┬────┘                 │
│       │            │            │                       │
│  ┌────┴────┐  ┌────┴────┐  ┌────┴────┐                 │
│  │   SNG   │  │   SNG   │  │   SNG   │  (1:1 ratio)    │
│  └────┬────┘  └────┴────┘  └────┬────┘                 │
│       │            │            │                       │
│       └────────────┼────────────┘                       │
│                    │                                    │
│              ┌─────┴─────┐                              │
│              │    SRC    │  (Secure ReComputer)        │
│              └─────┬─────┘                              │
│                    │                                    │
└────────────────────┼────────────────────────────────────┘
                     │
                 Internet
```

**Key components:**
- **Servers**: GPU nodes with interconnect removed, NVMe removed, airgapped except through SNG
- **SNG (Secure Network Gateway)**: Logs all I/O, samples for verification, enforces whitelisted models
- **SRC (Secure ReComputer)**: Receives sampled I/O pairs, does proof-of-work recomputation to verify inference

## Server Isolation Requirements

Transform servers into "memoryless individual compute units":

| Requirement | Implementation |
|-------------|----------------|
| No interconnect | Physically remove NVLink/InfiniBand |
| No persistent state | Remove all NVMe/SSD from servers |
| Airgapped | Only network path is through SNG |
| Ephemeral models | Secure boot uploads whitelisted weights on each power cycle |

## Secure Network Gateway (SNG)

### Logical Properties

1. **Tamper = Brick**: Device is (OFF ∨ untampered), else non-functional
2. **Upload Mode → Serving Mode**: On boot, accepts model weights, checks hash against whitelist. After `S` bits (where S = model size), transitions to SERVING MODE. Hash mismatch → power kill → restart
3. **Probabilistic Sampling**: In SERVING MODE, stores+tags all I/O pairs, deletes with probability `1-ε`, sends remainder to SRC

### Physical Components

| Component | Function |
|-----------|----------|
| IROM (Immutable ROM) | Hardcoded secure boot protocol, can't be overwritten |
| NVMe (~1TB) | Stores whitelist hashes + rolling I/O buffer |
| Hardware UID | Derived key unknown to manufacturer; tampering breaks UID → breaks encryption → brick |
| TRNG | True random number generator for sampling |
| Input NIC pair | Receive from internet → send to server |
| Output NIC pair | Receive from server → send to internet |
| Volatile Bit Counter | Tracks upload progress, zeroes on power loss |
| Input copier+tagger | Copies inputs, tags with counter state |
| Output copier+tagger | Copies outputs, matches to input tags |
| Coordinator + AES engine | Manages encryption, validates hashes |
| SRC NIC + sampler | Sends sampled pairs to SRC |

### Property Implementation

- **Property 1**: UID breaks on tamper → encryption fails → I/O path fails → brick
- **Property 2**: Counter fresh on boot, asymmetric encryption on input path, decrypter checks hashes, counter interrupts at S (→ SERVING), hash mismatch interrupts earlier (→ power kill)
- **Property 3**: Input path tags all inputs (trusts inputter for delimiter), output path saves + receives tag, TRNG samples, non-deleted pairs → SRC

## Secure ReComputer (SRC)

### Logical Properties

1. **Tamper = Brick**: Same as SNG
2. **Request Types**:
   - `INPUT = (input_text, model_id)` → routes to SNG serving that model
   - `ADMIN_REQUEST = (auth, instructions)` → [TODO: specify admin protocol]
3. **Proof Requests**: Receives `(input, output, model_id)` from SNGs, does recomputation
4. **Verification**: PASS → continue; FAIL → alarms + shutdown

### Open Design Questions

- What happens if no SNG is serving requested `model_id`?
- Admin request authentication and authorization model?
- How to handle non-deterministic inference (sampling temperature, batching)?

## Datacenter Physical Security

| Measure | Purpose |
|---------|---------|
| Vetted guards + entry/exit protocols | Prevent unauthorized physical access |
| Analog sensors | Confirm power state (cluster on/off) |
| Radio signal sensors | Detect covert RF communication bypassing network tap |
| Seals + cameras | Make tampering detectable |

## Deployment Timeline & Costs

**Assumptions for 100M H100-equivalents (~40% of global AI compute in early 2029):**

| Metric | Value |
|--------|-------|
| Avg H100e per server | 400 |
| Total servers | 250K |
| Team composition | 4 people (2 US, 2 Chinese) |
| Servers per team-hour | 1 |
| Total teams | 1,000 |
| Wall clock time | 5 weeks (50-hr weeks) |
| Manufacturing cost | $100M ($400/server) |
| Labor cost | $100M (1M hrs × $100/hr) |
| **Total installation cost** | **$200M** |
| Expected monthly revenue from 100M H100e | $100B |
| Installation cost as % of monthly revenue | 0.2% |

**Rollout schedule (early 2029):**

| Phase | Cluster Size | Cumulative H100e | Time |
|-------|--------------|------------------|------|
| 1 | >10M H100e clusters | 50M | 2.5 weeks |
| 2 | >1M H100e clusters | 100M | +2.5 weeks |
| 3 | >100K H100e clusters | 100M | +5 weeks |
| **Total** | | **~90% global compute** | **3 months** |

Clusters 1K–100K H100e (~9% of compute) can be powered off during installation, verified later. Result: 99% of global compute either inference-only or offline after 3-month installation phase.

## Attack Vectors & Mitigations

| Attack | Mitigation |
|--------|------------|
| Reintroduce interconnect | Physical monitoring, tamper-evident cameras, guards |
| Distributed training over internet | Network gateway logs all I/O, random recomputation proves inference |
| Expert iteration (inference for RL, gradients elsewhere) | Whitelist models, periodic power flicker + memory wipe + secure reboot |
| Rogue model persists in memory | Remove NVMe, periodic forced reboots with fresh model upload |
| Covert RF communication | Radio signal sensors, triangulation |
| Tamper with SNG/SRC | Hardware UID, tamper = brick |

## Open Questions

- **Nondeterminism**: How to verify inference when outputs depend on sampling temperature, batch composition, or timing? Require deterministic mode? Accept probabilistic verification?
- **Upload bandwidth limits**: How long does secure boot take for a 1TB model? What's the attack surface during upload?
- **Proof-of-work coverage**: What fraction of I/O pairs must be recomputed for statistical confidence? How does this scale with cluster size?
- **Preparation phase**: If US/China haven't pre-manufactured verification devices, how long is the buffer period? What interim measures (interconnect removal only, human intelligence) provide deterrence?
- **Admin protocol**: Who can issue ADMIN_REQUESTs? What instructions are permitted? How to prevent abuse?

## References

- [Network Exhaustion Protocol](https://arxiv.org/abs/2511.02620)
- [Inference Verification doc](https://docs.google.com/document/d/17LcWmrsvEl3tj97An1-ufHZ03go7qEpCxqRRegObESY/edit)
