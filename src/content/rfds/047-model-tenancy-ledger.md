---
title: "Model Tenancy Ledger Attestation"
number: "047"
author: "Oxford Martin AI Governance Initiative"
state: "idea"
tags: ["verification", "inference", "logging", "attestation", "hardware"]
created: "2024-11-27"
---

## The Idea

Hardware mechanism that maintains a tamper-evident log of all models ever loaded into GPU memory. Every model-loading operation writes a fingerprint and timestamp to nonvolatile storage. Remote attestation or physical inspection can reveal this complete history.

This creates an audit trail proving which models have run on governed hardware, enabling detection of unauthorized model deployment.

## Why It Matters

Model fingerprint attestation (RFD 041) proves what's loaded *now*. The tenancy ledger proves what's *ever* been loaded. This enables:
- Detecting past policy violations even if current state is compliant
- Verifying that only approved models have ever run on specific hardware
- Enforcing bans on inference using models with unknown fingerprints
- Auditing after incidents to determine what models were involved

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      GPU / ACCELERATOR                  │
│                                                         │
│  ┌─────────────────┐      ┌─────────────────────────┐  │
│  │   HBM / MEMORY  │      │   GUARANTEE PROCESSOR   │  │
│  │                 │      │                         │  │
│  │  [Model Weights]│─────►│  • Compute fingerprint  │  │
│  │                 │      │  • Write to ledger      │  │
│  └─────────────────┘      │  • Sign with device key │  │
│                           └───────────┬─────────────┘  │
│                                       │                 │
│                           ┌───────────▼─────────────┐  │
│                           │   NONVOLATILE LEDGER    │  │
│                           │                         │  │
│                           │  Entry 1: [FP, TS, Sig] │  │
│                           │  Entry 2: [FP, TS, Sig] │  │
│                           │  Entry 3: [FP, TS, Sig] │  │
│                           │  ...                    │  │
│                           └─────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Ledger Entry Format

Each entry contains:

| Field | Size | Description |
|-------|------|-------------|
| Model fingerprint | 32 bytes | SHA-256 of model weights |
| Timestamp | 8 bytes | Hardware-attested time of loading |
| Load duration | 4 bytes | How long model was in memory |
| Device signature | 64 bytes | Signed by hardware private key |
| Sequence number | 8 bytes | Monotonic counter (prevents deletion) |

Total: ~116 bytes per entry

## Storage Requirements

| Scenario | Entries/day | Storage/year |
|----------|-------------|--------------|
| Inference server (frequent swaps) | 100 | ~4 MB |
| Training cluster (rare swaps) | 1 | ~40 KB |
| High-churn multi-tenant | 1000 | ~40 MB |

Modest nonvolatile storage (GB-scale) provides decades of history.

## Attestation Protocol

```
1. VERIFIER requests ledger attestation

2. HARDWARE reads ledger contents

3. GUARANTEE PROCESSOR:
   - Computes hash of complete ledger
   - Signs hash with device private key
   - Includes current sequence number

4. RESPONSE sent to Verifier:
   - Full ledger contents (or summary)
   - Signed attestation of completeness

5. VERIFIER checks:
   - Signature valid for known device key
   - Sequence numbers contiguous (no gaps)
   - All fingerprints on approved list
```

## Tamper Resistance

| Attack | Mitigation |
|--------|------------|
| Delete entries | Monotonic sequence number creates detectable gaps |
| Modify entries | Each entry signed by hardware key |
| Replace entire ledger | Ledger hash periodically committed externally |
| Rollback to earlier state | External commitments detect rollback |
| Compromise hardware key | Key extraction difficulty, multi-party verification |

## Privacy Considerations

Full ledger reveals:
- All models ever used (may be trade secrets)
- Usage patterns and timing
- Potentially sensitive workload information

Mitigation options:
- Reveal only hashes, prove membership in approved set via ZKP
- Aggregate attestation ("only approved models used") without details
- Time-delayed revelation (escrow)

## Open Questions

- How to manage ledger size over long hardware lifetimes?
- Can security be maintained without relying solely on hardware private keys?
- How to handle legitimate model updates and versioning? (Same model, different versions)
- What happens when hardware is sold or repurposed between organizations?
- How to handle tensor-parallel models split across multiple devices?
- Can the ledger survive hardware failures and still be attestable?

## Relationship to Other RFDs

| RFD | Relationship |
|-----|--------------|
| RFD 041 (Model Fingerprint Attestation) | Fingerprinting is per-query; ledger is historical record |
| RFD 019 (Guarantee Processor) | GP implements ledger write and attestation |
| RFD 008 (Attested Logging) | Ledger is a specialized form of attested log |
| RFD 031 (Chip Registry) | Ledger keyed to chip identity from registry |

## References

- Oxford Martin source document Appendix L.5
- TPM (Trusted Platform Module) event log design
- Blockchain-inspired append-only log structures
