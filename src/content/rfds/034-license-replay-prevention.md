---
title: "License Replay Prevention"
number: "034"
author: "RAND Corporation"
state: "idea"
tags: ["verification", "hardware", "cryptography"]
created: "2024-11-27"
---

## The Idea

Prevent the same license from being applied to a chip multiple times. Without replay prevention, an attacker could save a valid license and reapply it indefinitely, defeating the compute rationing intent of offline licensing.

Two primary approaches:
1. **Hash log**: Store hashes of all previously applied licenses; reject any license whose hash is already in the log
2. **Sequence numbers**: Each license contains a monotonic sequence number; chip stores the highest seen number and rejects any license with a lower or equal number

## Why It Matters

Replay attacks are the most obvious vulnerability in offline licensing schemes. If an attacker can reuse licenses, compute rationing becomes meaningless. Replay prevention must be:
- Implemented in hardware (software solutions can be bypassed)
- Robust to power cycling (state must persist)
- Space-efficient (can't store infinite history)
- Resistant to rollback attacks

## Approach 1: Hash Log

```
ON LICENSE RECEIPT:

1. Compute hash H = SHA-256(license)

2. Check if H exists in license_log
   - If yes: REJECT (replay detected)
   - If no: continue

3. Verify license signature and device ID
   - If invalid: REJECT

4. Add H to license_log (persistent storage)

5. Apply license to meters
```

**Storage requirements**: 32 bytes per license. For 1000 licenses over device lifetime: 32 KB.

**Limitation**: Unbounded growth if many licenses applied. Could implement as ring buffer (oldest entries overwritten), but then very old licenses become replayable.

## Approach 2: Sequence Numbers

```
ON LICENSE RECEIPT:

1. Extract sequence_number from license

2. Read last_sequence from secure storage

3. Check if sequence_number > last_sequence
   - If no: REJECT (replay or out-of-order)
   - If yes: continue

4. Verify license signature and device ID
   - If invalid: REJECT

5. Update last_sequence = sequence_number (persistent storage)

6. Apply license to meters
```

**Storage requirements**: 8 bytes (single counter).

**Limitation**: Licenses must be applied in order. If license #5 is applied before license #4, license #4 becomes permanently unusable.

## Hybrid Approach

```
License contains:
- sequence_number (coarse ordering)
- license_id (unique identifier)

ON LICENSE RECEIPT:

1. Check sequence_number >= last_sequence - WINDOW
   - If no: REJECT (too old)

2. Check license_id not in recent_license_log
   - If yes: REJECT (replay)

3. Verify signature and device ID

4. Add license_id to recent_license_log

5. Update last_sequence = max(last_sequence, sequence_number)

6. Prune recent_license_log entries older than WINDOW

7. Apply license
```

This allows out-of-order application within a window while bounding storage.

## Secure Storage Requirements

The sequence counter or hash log must be stored in:

| Storage Type | Pros | Cons |
|--------------|------|------|
| **OTP (one-time programmable) fuses** | Cannot be reset even with physical access | Limited write cycles; eventually exhausted |
| **Battery-backed SRAM** | Unlimited writes; fast | Battery removal resets state |
| **Flash with wear leveling** | High capacity; persistent | Can potentially be reflashed with physical access |
| **PUF-protected NVRAM** | Tamper-evident | Complex implementation |

The RAND paper recommends combining approaches: primary storage in protected flash, with critical counters also written to OTP fuses as a backup that survives even sophisticated physical attacks.

## Rollback Attack Mitigation

An attacker might try to restore the chip to an earlier state where fewer licenses have been consumed:

| Attack | Mitigation |
|--------|------------|
| Restore flash backup | OTP fuse records minimum sequence number ever seen |
| Replace entire storage chip | Storage chip authenticated to main die via PUF or shared secret |
| Fault injection on counter | Redundant counters with voting; sanity checks |
| Power glitch during write | Atomic write operations; journaling |

## External Commitment Option

For highest security, chips could periodically transmit commitments to an external ledger:

```
Every N licenses applied:
1. Compute commitment = Sign(device_id, current_sequence, timestamp)
2. Transmit commitment to external service (optional)
3. Store commitment locally

On verification request:
- Provide all stored commitments
- External service can verify sequence continuity
- Gaps indicate potential tampering
```

This creates an audit trail even if local storage is eventually compromised.

## Open Questions

- What's the expected license volume over a chip's lifetime? (Determines storage sizing)
- How to handle legitimate scenarios where licenses are issued but never delivered?
- Can sequence number gaps be allowed for fault tolerance without enabling attacks?
- What's the cost of OTP fuses for replay-critical state?
- How to recover from accidental counter corruption without enabling reset attacks?

## References

- RAND WR-A3056-1, Chapter 6: License subsection
- TPM monotonic counter specifications
- Anti-rollback mechanisms in secure boot
