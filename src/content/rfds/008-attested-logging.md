---
title: "Attested Logging with Existing Hardware"
number: "008"
author: "James Petrie"
state: "discussing"
tags: ["verification", "tee", "attestation", "gpu-firmware"]
created: "2024-11-26"
---

## The Idea

Assess whether existing hardware roots of trust can produce internationally-trusted attestations. Candidates: TEE/Confidential Computing for software attestation, GPU firmware for kernel and performance counter logging, DC-SCM for power usage, NIC firmware for network connections.

Key questions: How difficult is it to extract secret keys from Hopper or Blackwell chips? Is there non-volatile memory that could be manually extracted by verifiers to avoid relying on device signing keys? How can this memory be protected against secret modification?

## Why It Matters

New verification hardware takes years to design and deploy. If existing attestation mechanisms can be trusted (or modified to be trustworthy), verification could be deployed much faster. Even partial trust in existing hardware narrows the attack surface.

## Open Questions

- Which existing attestation mechanisms are closest to internationally trustworthy?
- What modifications (tamper-evident enclosures, hardware audits) could close the gap?
- Can TEE attestation be made robust against nation-state attackers?

## References

- [Concrete Applications of Confidential Computing for AI Transparency](https://docs.google.com/document/d/1x_80ELLa1rq9jjhSJ1f_2bUB-2SlytiI66waDUPQ2lk/edit)
- [Trail of Bits CC blog](https://blog.trailofbits.com/categories/confidential-computing/)
- [wiretap.fail](https://wiretap.fail/)
- [batteringram.eu](https://batteringram.eu/)
