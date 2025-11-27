---
title: "k-of-n Guarantee Update Mechanism"
number: "025"
author: "FlexHEG"
state: "idea"
tags: ["verification", "cryptography"]
created: "2024-11-27"
---

## The Idea

Guarantee logic must be updatable (governance needs evolve, vulnerabilities get discovered), but updates must be authorized by appropriate parties. A k-of-n signature scheme requires k out of n designated stakeholders to sign an update before it's accepted. Different update types can require different k values or different signer sets.

This prevents any single party from unilaterally weakening guarantees or weaponizing the update mechanism.

## Why It Matters

The update mechanism is the governance layer of flexHEG. Get it wrong and either: (1) guarantees can't adapt to new threats, or (2) a single compromised key can disable all protections. k-of-n with heterogeneous signers (different nations, different organizations) makes flexHEG viable for international agreements where no single party is fully trusted.

## Protocol (Pseudocode)

```python
def verify_update(
    binary: bytes,
    signatures: list[tuple[signer_id, signature]],
    authorized_signers: dict[signer_id, public_key],
    k: int
) -> bool:

    firmware_hash = sha256(binary)
    valid_signers = set()

    for signer_id, signature in signatures:
        if signer_id not in authorized_signers:
            continue
        if signer_id in valid_signers:  # no double-counting
            continue
        if verify_signature(firmware_hash, signature, authorized_signers[signer_id]):
            valid_signers.add(signer_id)
            if len(valid_signers) >= k:
                return True

    return False
```

## Update Types & Authorization

| Update Type | Example k/n | Rationale |
|-------------|-------------|-----------|
| Security patch | 2/5 | Fast response needed |
| New guarantee type | 4/7 | Significant capability change |
| Modify update rules | 6/7 | Meta-level change, high bar |
| Remove baseline guarantees | Impossible | Hardcoded minimum |

## Enforcement via Licensing

Voluntary updates are sufficient for attestation (certificate says which guarantee version it's for). For enforcement:

1. Accelerators require periodic license to operate
2. License specifies minimum firmware version
3. Guarantee Processor blocks operation if: license expired OR firmware version < minimum
4. Licenses delivered via any channel (no internet required—can use data diodes)

License validity period tradeoff:
- Shorter → faster enforcement of updates
- Longer → less operational burden

## Quantum Resistance

Updates should use post-quantum signatures (e.g., SPHINCS+, Dilithium). AI advances might accelerate quantum computing; signing keys must remain secure for decades.

## Commitment to Non-Updates

For some agreements, parties need assurance that certain restrictions *won't* be added. Options:

1. **Baseline ruleset**: Minimal guarantees hardcoded, can't be revoked (but can't be patched if vulnerabilities found)
2. **Sunset clauses**: Certain restrictions expire unless renewed
3. **Mutual veto**: Some update types require unanimous consent

## Proving Non-Signature

Easy to prove an update *was* signed (show signature). Proving an update was *not* signed by a party requires hardware-backed attestation from all devices holding that party's key.

## Open Questions

- How to bootstrap the initial signer set?
- What happens if a signer's key is compromised?
- Can signers delegate to automated systems for routine updates?
- How to handle signers who become unresponsive?
- What's the right k/n for different international configurations?

## References

- [zeroRISC: Post-quantum secure boot on OpenTitan](https://www.zerorisc.com/blog/post-quantum-secure-boot-on-opentitan)
- [NIST post-quantum cryptography standards](https://csrc.nist.gov/projects/post-quantum-cryptography)
- [Petrie 2024: Firmware-based offline licensing](https://arxiv.org/abs/2404.18308)
- [Data diodes for secure update delivery](https://doi.org/10.1145/1852666.1852692)
